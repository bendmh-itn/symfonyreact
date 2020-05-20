import React from 'react';
/*
<Pagination 
    currentPage={currentPage} 
    itemsPerPages={itemsPerPages} 
    length={customers.length} 
    onPageChange={handlePageChange}
/>
*/
const Pagination = ({currentPage, itemsPerPages, length, onPageChange}) => {

    const pagesCount = Math.ceil(length/itemsPerPages);
    const pages = [];

    for(let i = 1; i<= pagesCount; i++){
        pages.push(i);
    }

    return ( 
        <div>
            <ul className="justify-content-center pagination pagination-sm">
                <li className={"page-item" + (currentPage === 1 && " disabled")}>
                <button className="page-link" onClick={() => onPageChange(currentPage-1)}>&laquo;</button>
                </li>
                {pages.map(page => (
                    <li key={page} 
                    className={"page-item" + (currentPage === page && " active")}
                    >
                        <button 
                            className="page-link" 
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    </li>
                    )
                )}
                                    
                <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                <button className="page-link" onClick={() => onPageChange(currentPage+1)}>&raquo;</button>
                </li>
            </ul>
        </div>
     );
}

Pagination.getData = (items, currentPage, itemsPerPages) => {
    //Je récupère les éléments que je veux afficher
    //je récupère le premier élément de ma page (start = 3*10-10 = 20 pour la page 3)
    const start = currentPage * itemsPerPages - itemsPerPages;
    //je récupère mes éléments à afficher (je prends de l'élément 20 à 30 pour la page 3)
    return items.slice(start, start + itemsPerPages);
}
 
export default Pagination;