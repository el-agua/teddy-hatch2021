import { Router, useRouter } from "next/router";
import { prependOnceListener } from "node:process";
import { FC } from "react"
import Card from "./Card"
import Button from "./Button";
interface HistoryProps {
    userData: any
    patientData: any
}
function HistoryType(pred: any, userData: any) {
    const router = useRouter()
    switch (pred) {
        case -1:
            return (<Card color="gradient-to-r from-green-600 to-green-300">
                <div className="mb-2 text-7xl text-white"><strong>Create History.</strong></div>
                <div className=" mb-2 text-4xl text-white"><strong>General Cancer</strong></div>
                <div className=" mb-2 text-2xl text-white">Patient: {userData.username}</div>
                <div onClick={() => router.push('/createHistory')}>
                    <Button color="blue-500" textColor="white"><strong>Start</strong></Button>
                </div>
            </Card>)
        case 0:
            return (<Card color="gradient-to-r from-purple-600 to-indigo-300">
                <div className="mb-2 text-7xl text-white"><strong>Low Risk.</strong></div>
                <div className=" mb-2 text-4xl text-white"><strong>General Cancer</strong></div>
                <div className=" mb-2 text-2xl text-white">Patient: {userData.username}</div>
                <div className="text-xl text-white">We recommend:</div>
                <div className="text-md text-white">- Annual screenings for cancer</div>
                <div className="text-md text-white">- Maintain healthy habits</div>
                <div className="text-md text-white">- Continue with prevention measures</div>
            </Card>)
        case 1:
            return (<Card color="gradient-to-r from-blue-700 to-blue-400">
                <div className="mb-2 text-7xl text-white"><strong>Moderate Risk.</strong></div>
                <div className=" mb-2 text-4xl text-white"><strong>General Cancer</strong></div>
                <div className=" mb-2 text-2xl text-white">Patient: {userData.username}</div>
                <div className="text-xl text-white">We recommend:</div>
                <div className="text-md text-white">- Get regular screening for cancer</div>
                <div className="text-md text-white">- Maintaining healthy habits</div>
                <div className="text-md text-white">- Continue with prevention measures</div>
            </Card>)
        case 2:
            return (<Card color="gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                <div className="mb-2 text-7xl text-white"><strong>High Risk.</strong></div>
                <div className=" mb-2 text-4xl text-white"><strong>General Cancer</strong></div>
                <div className=" mb-2 text-2xl text-white">Patient: {userData.username}</div>
                <div className="text-xl text-white">We recommend:</div>
                <div className="text-md text-white">- Seeing a cancer specialist as soon as possible</div>
                <div className="text-md text-white">- Taking a genetic test</div>
                <div className="text-md text-white">- Continue with screening and prevention measures</div>
            </Card>)
        default:
            return (<Card color="gradient-to-r from-green-600 to-green-300">
                <div className="mb-2 text-7xl text-white"><strong>Create History.</strong></div>
                <div className=" mb-2 text-4xl text-white"><strong>General Cancer</strong></div>
                <div className=" mb-2 text-2xl text-white">Patient: {userData.username}</div>
                <div onClick={() => router.push('/createHistory')}>
                    <Button color="blue-500" textColor="white"><strong>Start</strong></Button>
                </div>
            </Card>)

    }
}
const History: FC<HistoryProps> = (props) => {
    return (HistoryType(props.patientData.prediction, props.userData))
}

export default History;