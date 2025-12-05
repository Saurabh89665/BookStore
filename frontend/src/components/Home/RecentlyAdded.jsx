import React, { useEffect, useState } from 'react'
import BookCard from '../BookCard/BookCard';
import axios from "axios"

const RecentlyAdded = () => {
    const [Data,setData]=useState([]);

    useEffect(()=>{
        const fetch = async ()=>{
            try{
                const response = await axios.get(
                    "http://localhost:1000/api/v1/get-recent-book"
                );
                console.log(response.data.data);
                setData(response.data.data);
            }catch(error){
                console.log("Error fetching:", error);
            }
        };
        fetch();
    },[]);

  return (
     <div className="mt-8 px-4">
   <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-300 text-transparent bg-clip-text mb-6 relative w-fit">
  Recently Added Books
  <span className="block h-[3px] w-20 bg-emerald-400 rounded-full mt-1"></span>
</h1>

      <div className="my-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Data.map((items, i) => (
          <BookCard key={items._id || i} data={items} />
        ))}
      </div>
    </div>
  )
}

export default RecentlyAdded
