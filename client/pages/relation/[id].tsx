import { FC, useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Link from 'next/link'
import Card from "../../components/Card"
import axios from "axios"
import NavBar from "../../components/NavBar"
import Button from "../../components/Button"
import jwt_decode from "jwt-decode"
import patientService from "../../services/patientService"
const Relation: FC = (props: any) => {
    var router = useRouter()
    const { id }: any = router.query
    const [data, setData]: any = useState()
    useEffect(() => {
        patientService.GetPatientByID(props.token, parseInt(id)).then((patient) => {
            console.log(patient)
            setData(patient.data)
        })
    }, [])
    return (<div>
        <NavBar userData={props.userData}></NavBar>
        <div>
            <div className="p-7">
                <div className="grid grid-cols-3 gap-4">
                    <div>

                        <Button color="blue-500">
                            <Link href="/doctor">
                                <div className="text-white">Back</div>
                            </Link>
                        </Button>

                    </div>
                    <div>
                        <Card color="green-300"><div className="text-6xl text-white"><strong>{data ? data.user.username : ""}</strong></div><div className="text-xl text-white"><strong>Hereditary History</strong></div></Card>
                        {data ? data.rel_relation.map((patient: any, index: number) => (<div key={index} className="mt-3 text-2xl"><Card><div>Relationship: <strong>{patient}</strong></div><div>Cancer Type: <strong>{data.rel_cancer[index]}</strong></div><div>Diagnosis Age: <strong>{data.rel_age[index]}</strong></div><div></div></Card></div>)) : <div></div>}
                    </div></div></div></div></div>)
}
export async function getServerSideProps(context: any) {
    const cookies = context.req.headers.cookie;
    if (cookies == undefined) {
        return { redirect: { destination: "/login", permanent: false } }
    }
    var tok = cookies.substring(6)
    var data = ""
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
    } else {
        return { redirect: { destination: "/login", permanent: false } }
    }


    return {
        props: { userData: data, token: tok }, // will be passed to the page component as props
    }
}

export default Relation