import Card from "../components/Card";
import NavBar from "../components/NavBar";
import HistoryChange from "../components/HistoryChange"
import { FC } from "react"
import SignUpForm from "../components/SignUpForm"
import History from "../components/History"
import Select from "../components/Select"
import Link from "next/link"
import Button from "../components/Button"
import Column from "../components/Column"
import jwt_decode from "jwt-decode";
import axios from "axios"
function PredictionFixer(pred: number): string {
    switch (pred) {
        case -1:
            return "No Recommendation"
        case 0:
            return "Low Risk"
        case 1:
            return "Moderate Risk"
        case 2:
            return "Strong Risk"
        default:
            return "No Recommendation"
    }
}
const Doctor: FC = (props: any) => {
    return (
        <div>
            <NavBar userData={props.userData}></NavBar>
            <div className="flex p-7 justify-center">

                <div>
                    <div className="flex justify-center">
                        <div className="w-1/2 mb-4">
                            <Card color="red-400"><div className="text-6xl text-white"><strong>{props.userData ? props.userData.username : ""}</strong></div><div className="text-xl text-white"><strong>Doctor Portal</strong></div></Card>
                        </div>
                    </div>
                    <div className="flex">
                        <Column round="rounded-tl-lg" label="Patient" rows={props.patientData.map((patient: any) => patient.user.username)}></Column>
                        <Column label="Email" rows={props.patientData.map((patient: any) => patient.user.email)}></Column>
                        <Column label="Ethnicity" rows={props.patientData.map((patient: any) => patient.ethnicity)}></Column>
                        <Column label="Diagnosis Age" rows={props.patientData.map((patient: any) => patient.cancer_dx)}></Column>
                        <Column label="Cancer" rows={props.patientData.map((patient: any) => patient.cancer_dx_type)}></Column>
                        <Column label="Age" rows={props.patientData.map((patient: any) => patient.cancer_dx_age)}></Column>
                        <Column label="Prediction" rows={props.patientData.map((patient: any) => PredictionFixer(patient.prediction))}></Column>
                        <Column round="rounded-tr-lg" label="History" rows={props.patientData.map((patient: any) => <Button color="purple-500"><Link href={`/relation/${patient.id}`}><div className="text-sm">View</div></Link></Button>)}></Column>
                    </div>
                </div>

            </div>
        </div>
    );
}
export async function getServerSideProps(context: any) {
    const cookies = context.req.headers.cookie;
    if (cookies == undefined) {
        return { redirect: { destination: "/login", permanent: false } }
    }
    var tok = cookies.substring(6)
    var data: any
    var patientData: any
    if (tok != undefined && tok != "undefined") {
        var decoded: any = jwt_decode(tok);
        var id = decoded.user_id
        console.log("I'm here")
        await axios.get(`https://api.demo.federico.codes/users/${id}`, {
            headers: {
                'Authorization': `${tok}`
            }
        }).then((user) => {
            data = user.data
        }).catch(e => console.log(e))
        if (data.admin == 0) {
            return { redirect: { destination: "/dashboard", permanent: false } }
        }
        await axios.get(`https://api.demo.federico.codes/patients`, {
            headers: {
                'Authorization': `${tok}`
            }
        }).then((user) => {
            patientData = user.data
        }).catch(e => console.log(e))
    } else {
        return { redirect: { destination: "/login", permanent: false } }
    }
    console.log(patientData)
    if (patientData.length == 0) {
        return { props: { userData: data, patientData: patientData } }
    } else {
        return {
            props: { userData: data, patientData: patientData }, // will be passed to the page component as props
        }
    }
}
export default Doctor;
