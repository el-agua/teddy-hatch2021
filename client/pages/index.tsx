import Card from "../components/Card";
import NavBar from "../components/NavBar";
import HistoryChange from "../components/HistoryChange"
import { FC } from "react"
import SignUpForm from "../components/SignUpForm"
import History from "../components/History"
import Select from "../components/Select"
import Button from "../components/Button"
import Column from "../components/Column"
import jwt_decode from "jwt-decode";
import axios from "axios"

const Home: FC = (props: any) => {
  return (
    <div>
      <NavBar userData={props.userData}></NavBar>
      <div className="p-7">
        <div></div>

        <div className="absolute top-1/2 w-full text-8xl text-center">
          <strong>Teddy<span className="text-blue-600">.</span> Your medical assistant.</strong>
        </div>

        <div></div>

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
  return { props: { userData: data } } // will be passed to the page component as props

}
export default Home;
