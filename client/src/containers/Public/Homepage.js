import React from 'react'
import { text } from '../../ultils/constant'
import { Province, ItemSidebar, RelatedPost } from '../../components'
import { List, Pagination, Search } from './index'

import { useSelector } from 'react-redux'


const Homepage = () => {
    const { categories, prices, areas } = useSelector(state => state.app)

    return (
        <div className='w-full h-full flex flex-col gap-3 items-center justify-center'>

            <div className='w-full flex flex-col  text-center'>
                <h1 className='text-[28px] font-semibold'>{text.HOME_TITLE}</h1>
                <p className='text-base text-gray-700'>{text.HOME_DESCRIPTION}</p>
            </div>
            <div className='w-full flex flex-col  text-center'>
                <p className='text-[18px] font-semibold ' >Khu vực nổi bật</p>
                <Province />
            </div>

            <Search />

            <div className='w-full flex gap-4'>
                <div className='w-[70%]'>
                    <List />
                    <Pagination />
                </div>
                <div className='w-[30%] flex flex-col gap-4'>
                    <ItemSidebar title='Danh sách cho thuê' items={categories} />
                    <ItemSidebar title='Xem theo giá' items={prices} />
                    <ItemSidebar title='Xem theo diện tích' items={areas} />
                    <RelatedPost />
                </div>
            </div>
        </div>
    )
}

export default Homepage;