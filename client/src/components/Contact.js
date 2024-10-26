import React from 'react';
import styled from 'styled-components';
import { text } from '../ultils/dataContact';
import { Button } from '../components';

const ContactContainer = styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px;
    width: 100%;
    @media (min-width: 768px) {
        width: 60%;
    }
    @media (min-width: 993px) and (max-height: 1156px) {
        width: 50%;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin: auto;
`;

const Image = styled.img`
    width: 100%;
    height: 192px;
    object-fit: contain;
`;

const ContactInfo = styled.div`
    display: flex;
    flex-direction: column;
    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-around;
        width: 100%;
    }
`;

const ContactItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    @media (min-width: 768px) {
        margin-bottom: 0;
    }
`;
const ContactText = styled.span`
    color: #FF7F50; /* Orange color */
    font-weight: bold;
`;

const ContactDetail = styled.span`
    color: #1E3A8A; /* Dark blue color */
    font-size: 14px;
    font-weight: bold;
`;

const Contact = () => {
    return (
        <ContactContainer className='container'>
            <Image
                src={text.image}
                alt="thumbnail"
            />
            <p className='text-center'>{text.content}</p>
            <ContactInfo>
                {text.contacts.map((item, index) => (
                    <ContactItem key={index}>
                        <ContactText>{item.text}</ContactText>
                        <div className='flex items-center'>
                            <ContactDetail>{item.phone}</ContactDetail>
                            <span className='text-blue-900 text-[14px] ml-2'>{item.number}</span>
                        </div>
                        <div className='flex items-center'>
                            <ContactDetail>{item.mail}</ContactDetail>
                            <span className='text-blue-900 text-[14px] ml-2'>{item.email}</span>
                        </div>
                    </ContactItem>
                ))}
            </ContactInfo>
            <Button
                text='Gửi liên hệ'
                bgColor='bg-blue-600'
                textColor='text-white'
                px='px-6'
            />
        </ContactContainer>
    );
}

export default Contact;