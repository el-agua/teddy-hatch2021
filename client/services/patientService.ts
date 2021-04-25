import axios from 'axios'

interface ResponsePayload{
    id: number
    username: string
    email: string
    password: string
    admin: boolean
}
interface PatientPayload{
    id?: number
    ethnicity?: string
    cancer_dx?: string
    cancer_dx_type?: string
    cancer_dx_age?: number
    rel_relation?: string[]
    rel_cancer?: string[]
    rel_age?:string[]
    user_id?: number
}

function CreatePatient(formData: any, user_id: number, token: string): Promise<any>{
    console.log(formData)
    const payload: PatientPayload = {
        ethnicity: formData.ethnicity,
        cancer_dx: formData.cancerDX,
        cancer_dx_type: formData.cancerDXType,
        cancer_dx_age: parseInt(formData.cancerDXAge),
        rel_relation: [],
        rel_cancer: [],
        rel_age: [],
        user_id: user_id
    }
    payload.rel_relation = formData.relations.map((person: any) => person.relationship)
    payload.rel_cancer = formData.relations.map((person: any) => person.cancer)
    payload.rel_age = formData.relations.map((person: any) => person.age)
    console.log(payload)
    return axios.post(`/api/patients`, payload, {
        headers: {
          'Authorization': `${token}`
        }
      }).then((patient)=>patient).catch((e)=> e)
}

function GetPatient(token:string){
    return axios.get(`/api/patients`,  {
        headers: {
          'Authorization': `${token}`
        }
      }).then((patient)=>patient).catch((e)=> e)
}

function GetPatientByID(token: string, id: number){
    return axios.get(`/api/patients/${id}`,  {
        headers: {
          'Authorization': `${token}`
        }
      }).then((patient)=>patient).catch((e)=> e)
}



export default {CreatePatient, GetPatient, GetPatientByID}