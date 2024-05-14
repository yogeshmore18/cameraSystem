import axios from "axios"
import { useQuery } from "react-query"

export const CameraStatus = () => {
    return useQuery("gettingCameraStatus", () =>
        axios.get("http://localhost:5001/cameraStatus")
            .then(
                res => res.data
            )
            .catch(error=>{
                console.error("No Connection...",error)
            })   
    )
}

export const CabinOverview = () => {
    return useQuery("gettingCabinOverview", () =>
        axios.get("http://localhost:5001/cabinOverview")
            .then(
                res => res.data
            )
            .catch(error=>{
                console.error("No Connection...",error)
            })   
    )
}
