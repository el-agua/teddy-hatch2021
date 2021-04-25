import Card from "../components/Card";
import { FC } from "react"
import NavBar from "../components/NavBar"
import Select from "../components/Select"
import jwt_decode from "jwt-decode";
import axios from "axios"
import HistoryForm from "../components/HistoryForm";
const LogIn: FC = (props: any) => {
    return (<div>
        <NavBar userData={props.userData}></NavBar>
        <div>
            <div className="p-7">
                <div className="grid grid-cols-3 gap-4">
                    <div></div>
                    <Card title="Create a Hereditary History" titleAlign="center">
                        <div className="text-center text-black">Take control of your health!</div>
                        <div className="mt-10">
                            <HistoryForm token={props.token} user_id={props.userData.id}></HistoryForm>
                        </div>
                    </Card>

                    <div></div>
                </div>
            </div>
        </div>
    </div>
    );
}
export async function getServerSideProps(context: any) {
    const cookies = context.req.headers.cookie;
    if (cookies == undefined) {
        return { redirect: { destination: "/login", permanent: false } } // will be passed to the page component as props

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
export default LogIn;
