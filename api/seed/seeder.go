package seed

import (
	"log"

	"github.com/elleven11/patient_api/api/models"
	"github.com/jinzhu/gorm"
	"github.com/lib/pq"
)

var users = []models.User{
	{
		Username: "administrator",
		Email:    "federico.cassano@federico.codes",
		Password: "password",
		Admin:    true,
	},
	{
		Username: "guest",
		Email:    "guest@federico.codes",
		Password: "password",
	},
}

var patients = []models.Patient{
	{
		Ethnicity:    "Hispanic",
		CancerDx:     "yes",
		CancerDxType: "Breast",
		CancerDxAge:  36,
		RelRelation:  pq.StringArray{"Mother", "Father"},
		RelCancer:    pq.StringArray{"Lung", "Breast"},
		RelAge:       pq.StringArray{"44", "55"},
		Active:       1,
		Prediction:   -1,
	},
	{
		Ethnicity:   "White",
		CancerDx:    "no",
		RelRelation: pq.StringArray{"Grandfather"},
		RelCancer:   pq.StringArray{"Lung"},
		RelAge:      pq.StringArray{"74"},
		Active:      0,
		Prediction:  -1,
	},
}

func Load(db *gorm.DB) {
	err := db.Debug().DropTableIfExists(&models.Patient{}, &models.User{}).Error
	if err != nil {
		log.Fatalf("cannot drop table: %v", err)
	}

	err = db.Debug().AutoMigrate(&models.User{}, &models.Patient{}).Error
	if err != nil {
		log.Fatalf("cannot migrate table: %v", err)
	}

	err = db.Debug().Model(&models.Patient{}).AddForeignKey("user_id", "users(id)", "cascade", "cascade").Error
	if err != nil {
		log.Fatalf("attaching foreign key error: %v", err)
	}

	for i, _ := range users {
		err = db.Debug().Model(&models.User{}).Create(&users[i]).Error
		if err != nil {
			log.Fatalf("cannot seed users table: %v", err)
		}

		patients[i].UserID = users[i].ID

		err = db.Debug().Model(&models.Patient{}).Create(&patients[i]).Error
		if err != nil {
			log.Fatalf("cannot seed patients talbe: %v", err)
		}
	}
}
