import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import '.././App.css';

const Paginator = ({totalPages, onPageChange, page}) => {

    const [pageNumbers,setPageNumbers] = useState([])

    useEffect(() => {
        setPageNumbers([]);
        for (let i = 1; i <= totalPages; i++) {
            setPageNumbers(pageNumbers => [...pageNumbers,i] );
        }
      }, [totalPages]);

    return (
            <nav className="align-center">
                <ul className="pagination">
                <li className="page-item">
                    <a className={`page-link circular-link-border ${page == 1 ? 'disabled' : 'clickable' }`}
                                 onClick={($event) => onPageChange($event,page-1)}>
                                    {'<'}
                                </a>
                </li>
                    {
                        pageNumbers.map(number => (
                            <li key={number} className="page-item">
                                <a className={`page-link circular-link-border ${page == number ? 'disabled' : 'clickable' }`}
                                 onClick={($event) => onPageChange($event,number)}>
                                    {number}
                                </a>
                            </li>
                        ))
                    }
                <li className="page-item">
                     <a className={`page-link circular-link-border ${page == pageNumbers[pageNumbers.length-1] ? 'disabled' : 'clickable' }`}
                        onClick={($event) => onPageChange($event,page+1)}>
                            {'>'}
                    </a>
                </li>
                </ul>
            </nav>
    );
}
export default Paginator;
