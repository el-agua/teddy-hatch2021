import { FC } from "react"
import Card from "./Card"
import Button from "./Button"
const HistoryChange: FC = () => {
    return (
        <Card>
            <div className="flex justify-between items-center">
                <div>Do you need to make any updates, changes to your history?</div>
                <Button color="green-300"><div className="text-sm">Update</div></Button>
            </div>
        </Card>
    )
}

export default HistoryChange;