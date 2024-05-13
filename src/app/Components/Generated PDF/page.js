"use client"

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const GeneratedPDF = dynamic(() => import('@/app/Components/PDF/page'), {
    ssr: false,
})

const View = ({ testProp }) => {
    console.log(testProp);
    const [client, setClient] = useState(false);

    useEffect(() => {
        setClient(true)
    }, [])
    
    return (
        <GeneratedPDF testProp={testProp} />
    )
}

View.propTypes = {
    testProp: PropTypes.string.isRequired,
};

export default View;