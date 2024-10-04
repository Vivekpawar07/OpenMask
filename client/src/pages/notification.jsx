import React from "react";
import {FollowAlert,LikeCommentAlert,ReportAlert} from "../dassy ui/alert"
export default function Notifications(){
    return(
        <>
        <div className="flex flex-col  w-[70%] mt-[80px] ml-[20%] mr-[15%]">
            <div className="flex flex-col p-5 gap-3 w-[86%] h-[85vh] bg-custom_grey rounded-2xl overflow-scroll">
                <FollowAlert/>
                <LikeCommentAlert/>
                <ReportAlert/>
                <FollowAlert/>
                <LikeCommentAlert/>
                <ReportAlert/>
                <FollowAlert/>
                <LikeCommentAlert/>
                <ReportAlert/>
                <FollowAlert/>
                <LikeCommentAlert/>
                <ReportAlert/>
            </div>
        </div>
        </>
    )
}