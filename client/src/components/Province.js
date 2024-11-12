import React, { useEffect, useState } from 'react';
import { ProvinceBtn } from './index';
import { location } from '../ultils/constant';
import { useNavigate } from 'react-router-dom';

const Province = () => {
    const navigate = useNavigate();
    const [filteredLocations, setFilteredLocations] = useState([]);

    useEffect(() => {
        // Filter the locations for the three provinces
        const defaultLocations = location.filter(item =>
            ['hcm', 'hn', 'dn'].includes(item.id)
        );
        setFilteredLocations(defaultLocations);
    }, []);

    return (
        <div className='flex items-center gap-5 justify-center py-5'>
            {filteredLocations.map(item => (
                <ProvinceBtn
                    key={item.id}
                    image={item.image}
                    name={item.name}
                    onClick={() => navigate(item.path)}
                />
            ))}
        </div>
    );
};

export default Province;