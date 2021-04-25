import Card from "../components/Card";
import { FC } from "react"
import LogInForm from "../components/LoginForm"
import NavBar from "../components/NavBar"
import Select from "../components/Select"
import jwt_decode from "jwt-decode";
import axios from "axios"
const LogIn: FC = (props: any) => {
    return (<div>
        <NavBar userData={props.userData}></NavBar>
        <div>
            <div className="p-7">
                <div className="grid grid-cols-3 gap-4">
                    <div></div>
                    <Card title="Log In" titleAlign="center">
                        <div className="text-center text-black">Take control of your health!</div>
                        <div className="mt-10">
                            <LogInForm></LogInForm>
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
        return { props: { userData: {} } }
    }
    console.log(cookies)
    var tok = cookies.substring(6)
    var data = ""
    console.log(tok)
    if (tok != undefined && tok != "undefined") {
        console.log(tok !== undefined)
        console.log(tok)
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
        return { props: { userData: {} } }
    }
    return { redirect: { destination: "/dashboard", permanent: false } }
}
export default LogIn;
