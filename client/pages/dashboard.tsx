import Card from "../components/Card";
import NavBar from "../components/NavBar";
import HistoryChange from "../components/HistoryChange"
import { FC } from "react"
import SignUpForm from "../components/SignUpForm"
import History from "../components/History"
import Select from "../components/Select"
import Button from "../components/Button"
import jwt_decode from "jwt-decode";
import axios from "axios"
const Dashboard: FC = (props: any) => {
    return (
        <div>
            <NavBar userData={props.userData}></NavBar>
            <div className="p-7">
                <div className="grid grid-cols-3 gap-4">
                    <div></div>
                    <div>
                        <History patientData={props.patientData} userData={props.userData}></History>
                    </div>
                    <div></div>
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
            console.log(data)
        }).catch(e => console.log(e))
        if (data.admin == 1) {
            return { redirect: { destination: "/doctor", permanent: false } }
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
        return { props: { userData: data, patientData: { prediction: -1 } } }
    } else {
        return {
            props: { userData: data, patientData: patientData[patientData.length - 1] }, // will be passed to the page component as props
        }
    }
}
export default Dashboard;
