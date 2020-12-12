import React from "react";
import {Modal as ModalAntD, Button} from 'antd';
import {
    Link,
} from "react-router-dom";

export default function Modal(props: { title: string, description: string }) {
    const {title, description} = props
    return (
        <ModalAntD
            closable={false}
            title={title}
            visible={true}
            footer={
                <Link to={'/'}>
                    <Button>go to the main page</Button>
                </Link>}>
            {description}
        </ModalAntD>
    )
}