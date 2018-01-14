import React from "react";
import { Button } from 'antd';

export default ({
    loading, 
    text, 
    loadingText, 
    disabled = false, 
    ...props
}) =>
    <Button
        disabled={disabled || loading}
        {...props}
    >
        {!loading ? text : loadingText}
    </Button>