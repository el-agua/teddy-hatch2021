import Card from "../components/Card";
import { FC } from "react"
import SignUpForm from "../components/SignUpForm"
import Select from "../components/Select"
import axios from "axios"
import jwt_decode from "jwt-decode";
import NavBar from "../components/NavBar"
const SignUp: FC = (props: any) => {
    return (
        <div>
            <NavBar userData={props.userData}></NavBar>
            <div className="p-7">
                <div className="grid grid-cols-3 gap-4">
                    <div></div>
                    <Card title="Sign Up" titleAlign="center">
                        <div className="text-center text-black">Take control of your health!</div>
                        <div className="mt-10">
                            <SignUpForm></SignUpForm>
                        </div>
                    </Card>

                    <div></div>
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
    var tok = cookies.substring(6)
    var data = ""
    if (tok != undefined && tok != "undefined") {
        var decoded: any = jwt_decode(tok);
        var id = decoded.user_id
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
    console.log("Hi")
    return { redirect: { destination: "/dashboard", permanent: false } } // will be passed to the page component as props

}
export default SignUp;
