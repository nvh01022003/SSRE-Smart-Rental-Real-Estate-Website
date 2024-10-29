import React, { useEffect } from 'react'
import { Item } from '../../components'
import { getPosts, getPostsLimit } from '../../store/actions/post'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

const List = ({ categoryCode }) => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const { posts } = useSelector(state => state.post)
    console.log(posts)

    useEffect(() => {
        let params = []
        for (let entry of searchParams.entries()) {
            params.push(entry);
        }
        let searchParamsObject = {}
        params?.forEach(i => {
            if (Object.keys(searchParamsObject)?.some(item => item === i[0])) {
                searchParamsObject[i[0]] = [...searchParamsObject[i[0]], i[1]]
            } else {
                searchParamsObject = { ...searchParamsObject, [i[0]]: [i[1]] }
            }
        })
        if (categoryCode) searchParamsObject.categoryCode = categoryCode
        dispatch(getPostsLimit(searchParamsObject))
        console.log(searchParamsObject)
    }, [searchParams, categoryCode, dispatch])
    return (
        <div className='w-full  bg-white shadow-md rounded-md '>
            <div className='flex items-center justify-between my-3'>
                <h4 className='text-xl font-semibold px-3 pl-3 pt-3'>Danh sách tin đăng</h4>
            </div>
            <div className='flex items-center gap-2 my-2 px-3 mb-5'>
                <span>Sắp xếp:</span>
                <button className="hover:text-blue-500 outline-none rounded-md hover:underline flex items-center justify-center gap-1 bg-gray-200 w-30 h-7 px-1">Mặc định</button>
                <button className="hover:text-blue-500 outline-none rounded-md hover:underline flex items-center justify-center gap-1 bg-gray-200 w-30 h-7 px-1">Mới nhất</button>
            </div>

            <div className='items'>
                {posts?.length > 0 && posts.map(item => (
                    <Item
                        key={item?.id}
                        address={`${item?.Address?.detail_address}, ${item?.Address?.district}, ${item?.Address?.city}`}
                        attributes={{
                            price: item?.price,
                            acreage: item?.acreage
                        }}
                        description={item?.description}
                        images={item?.Image.img_url_list}
                        // images={JSON.parse(item?.Images[0].img_url_list)}
                        //star={item?.star}
                        title={item?.title}
                        user={{
                            name: `${item?.User?.firstName} ${item?.User?.lastName}`,
                            phone: item?.User?.phone,
                            img_avt: item?.User?.img_avt
                        }}
                        id={item?.id}
                    />
                ))}
            </div>
        </div>
    )
}

export default List