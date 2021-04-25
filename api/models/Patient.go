package models

import (
	"errors"
	"html"

	"github.com/jinzhu/gorm"
	"github.com/lib/pq"
)

type Patient struct {
	ID           uint64         `gorm:"primary_key;auto_increment" json:"id"`
	Ethnicity    string         `gorm:"size:255" json:"ethnicity"`
	CancerDx     string         `gorm:"size:100" json:"cancer_dx"`
	CancerDxType string         `gorm:"size:255" json:"cancer_dx_type"`
	CancerDxAge  int64          `json:"cancer_dx_age"`
	RelRelation  pq.StringArray `gorm:"type:text[]" json:"rel_relation"`
	RelCancer    pq.StringArray `gorm:"type:text[]" json:"rel_cancer"`
	RelAge       pq.StringArray `gorm:"type:text[]" json:"rel_age"`
	Prediction   float64        `json:"prediction"`
	Active       int8           `gorm:"default:0" json:"active"`
	User         User           `json:"user"`
	UserID       uint32         `gorm:"not null" json:"user_id"`
}

func (p *Patient) Prepare() {
	p.ID = 0
	p.User = User{}

	// escaping html to prevent SQLi
	p.Ethnicity = html.EscapeString(p.Ethnicity)
	p.CancerDx = html.EscapeString(p.CancerDx)
	p.CancerDxType = html.EscapeString(p.CancerDxType)

	// had to iterate 3 times because we are doing Prepare before Validate
	for i := 0; i < len(p.RelRelation); i++ {
		p.RelRelation[i] = html.EscapeString(p.RelRelation[i])
	}
	for i := 0; i < len(p.RelCancer); i++ {
		p.RelCancer[i] = html.EscapeString(p.RelCancer[i])
	}
	for i := 0; i < len(p.RelAge); i++ {
		p.RelAge[i] = html.EscapeString(p.RelAge[i])
	}

}

func (p *Patient) Validate() error {

	if p.CancerDx == "" {
		return errors.New("CancerDx is required")
	}
	if p.UserID < 1 {
		return errors.New("An user is required")
	}

	if len(p.RelRelation) != len(p.RelCancer) {
		return errors.New("RelRelation length does not match RelCancer")
	}
	if len(p.RelRelation) != len(p.RelAge) {
		return errors.New("RelRelation length does not match RelAge")
	}

	return nil
}

func (p *Patient) CreatePatient(db *gorm.DB) (*Patient, error) {
	var err error
	err = db.Debug().Model(&Patient{}).Create(&p).Error
	if err != nil {
		return &Patient{}, err
	}

	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.UserID).Take(&p.User).Error
		if err != nil {
			return &Patient{}, err
		}
	}
	return p, nil
}

func (p *Patient) FindAllPatients(db *gorm.DB) (*[]Patient, error) {
	var err error
	patients := []Patient{}

	err = db.Debug().Model(&Patient{}).Limit(100).Find(&patients).Error
	if err != nil {
		return &[]Patient{}, err
	}

	if len(patients) > 0 {
		for i, _ := range patients {
			err := db.Debug().Model(&User{}).Where("id = ?", patients[i].UserID).Take(&patients[i].User).Error
			if err != nil {
				return &[]Patient{}, err
			}
		}
	}
	return &patients, nil
}

func (p *Patient) FindAllPatientsOfUid(db *gorm.DB, uid uint32) (*[]Patient, error) {
	var err error
	patients := []Patient{}

	err = db.Debug().Model(&Patient{}).Where("user_id = ?", uid).Find(&patients).Limit(100).Error
	if err != nil {
		return &[]Patient{}, err
	}

	if len(patients) > 0 {
		for i, _ := range patients {
			err := db.Debug().Model(&User{}).Where("id = ?", patients[i].UserID).Take(&patients[i].User).Error
			if err != nil {
				return &[]Patient{}, err
			}
		}
	}
	return &patients, nil
}

func (p *Patient) FindPatientByID(db *gorm.DB, pat_id uint64) (*Patient, error) {
	var err error

	err = db.Debug().Model(&Patient{}).Where("id = ?", pat_id).Take(&p).Error
	if err != nil {
		return &Patient{}, err
	}
	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.UserID).Take(&p.User).Error
		if err != nil {
			return &Patient{}, err
		}
	}
	return p, nil
}

func (p *Patient) UpdateAPatient(db *gorm.DB) (*Patient, error) {
	var err error

	err = db.Debug().Model(&Patient{}).Where("id = ?", p.ID).Updates(Patient{
		Ethnicity:    p.Ethnicity,
		CancerDx:     p.CancerDx,
		CancerDxType: p.CancerDxType,
		CancerDxAge:  p.CancerDxAge,
		RelRelation:  p.RelRelation,
		RelCancer:    p.RelCancer,
		RelAge:       p.RelAge,
		Active:       p.Active,
		Prediction:   p.Prediction,
	}).Error
	if err != nil {
		return &Patient{}, err
	}

	if p.ID != 0 {
		err = db.Debug().Model(&User{}).Where("id = ?", p.UserID).Take(&p.User).Error
		if err != nil {
			return &Patient{}, err
		}
	}
	return p, nil
}

func (p *Patient) DeletePatient(db *gorm.DB, pat_id uint64) (int64, error) {

	db = db.Debug().Model(&Patient{}).Where("id = ?", pat_id).Take(&Patient{}).Delete(&Patient{})

	if db.Error != nil {
		// if it does not find the Patient
		if gorm.IsRecordNotFoundError(db.Error) {
			return 0, errors.New("Patient was not found")
		}
		return 0, db.Error
	}
	return db.RowsAffected, nil
}
