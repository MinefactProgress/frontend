import React,{ useEffect } from "react";

import { useRouter } from "next/router";

const MilestonesPage = () => {
    const router = useRouter()
    useEffect(() => {
        window.location.href = "https://progressbackend.minefact.de/links/"+router.query.link;
    })
    return <div>
        <h2>Redirecting...</h2>
    </div>
  };
  export default MilestonesPage;
  