import React, {useState, useEffect} from 'react'
import "./style.css"
// https://www.youtube.com/watch?v=6DtBw3PaeHs
const renderData = data => {
    return(
        <ul>
            {data.map((listItems, index)=>{
                return <li key={index}>{listItems.title}</li>
            })}
        </ul>
    )
}

function PaginationComponent() {

    const [data, setData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [pageNumberLimit, setPageNumberLimit] = useState(5);
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);
    

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id))
    }

    const pages =[];

    for(let i=1; i<Math.ceil(data.length/itemsPerPage);i++){
        pages.push(i);
    }

    const indexOfLastItem = currentPage*itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    
    const renderPageNumbers = pages.map(number=>{
        if(number<maxPageLimit+1&&number>minPageLimit){
            
        return(
            <li 
            key={number} 
            id={number} 
            onClick={handleClick}
            className={currentPage == number ? "active" : null}
            >
                {number}
            </li>
        )
    
        }
        else return null
    })
    useEffect(()=>{ 
        fetch("https://jsonplaceholder.typicode.com/todos")
        .then(response=>response.json())
        .then((json)=>setData(json))
    },[]);

    const handleNextButton = () =>{
        setCurrentPage(currentPage+1);

        if(currentPage+1>maxPageLimit){
            setMaxPageLimit(maxPageLimit+pageNumberLimit)
            setMinPageLimit(minPageLimit+pageNumberLimit)
        }
    
    }
    const handlePreviousButton = () =>{
        setCurrentPage(currentPage-1);

        if((currentPage-1)%pageNumberLimit==0){
            setMaxPageLimit(maxPageLimit-pageNumberLimit)
            setMinPageLimit(minPageLimit-pageNumberLimit)
        }
    }
    let pageIncrementButton = null;
    if(pages.length > maxPageLimit){
        pageIncrementButton = <li onClick={handleNextButton}>&hellip;</li>
    }
    let pageDecrementButton = null;
    if(minPageLimit>=1){
        pageDecrementButton = <li onClick={handlePreviousButton}>&hellip;</li>
    }

    const handleLoadMore = ()=>{
        setItemsPerPage(itemsPerPage+5)
    }

    return (
        <>
           <h1>List</h1>
           {renderData(currentItems)}
           <ul className="pageNumbers">
               <li>
                   <button onClick={handlePreviousButton}disabled={currentPage==pages[0]?true:false}>Previous</button>
               </li>
               {pageDecrementButton}
               {renderPageNumbers}
               {pageIncrementButton}
               <li>
                   <button onClick={handleNextButton}disabled={currentPage==pages[pages.length-1]?true:false}>Next</button>
               </li>
           </ul>
           <ul><button className="loadMore" onClick={handleLoadMore}>Load</button></ul>
           
        </>
    )
}

export default PaginationComponent;
