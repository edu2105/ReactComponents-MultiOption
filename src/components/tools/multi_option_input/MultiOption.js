import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import ClearIcon from '@mui/icons-material/Clear';
import './MultiOption.css';

const MultiOption = ({loading, results, callback, onEnter, shareSelectedOptions, style}) => {
    const [inputValue, setInputValue] = useState("");
    const [isValueSearch, setIsValueSearch] = useState(false);
    const [selected, setSelected] = useState([]);

    const onInputChangeHandler = (e) => {
        const searchString = e.target.value;
        setInputValue(searchString);
        if(!onEnter){
            setIsValueSearch(true);   
            callback(searchString);
        };
    };
    const onClearHandler = () => {
        setIsValueSearch(false);
        setInputValue("");
    };
    const onInputKeyDownHandler = (e) => {
        if(e.key === 'Enter'){
            setIsValueSearch(true);   
            callback(e.target.value);
        };
    };
    const onItemClickHandler = (option) => {
        if(selected.some( item => item.id === option.id)){
            const selectedUpdated = selected.map( item => {
                if(item.id === option.id){
                  return {...item};
                }else{
                    return item;
                };
            });
            setSelected(selectedUpdated);
        }else{
            setSelected([...selected, option]);
        }
        setInputValue("");
        setIsValueSearch(false);
    };
    const onClearItemHandler = (id) => {
        selected.length === 1 ? setSelected([]) : setSelected(selected.filter(item => item.id !== id))
    };

    useEffect(() => {
        shareSelectedOptions(selected);
    }, [selected, shareSelectedOptions]);

    return (
        <div className='multioption-container' style={style}>
            <div className='search-section'>
                <input 
                    type="text" 
                    name="" 
                    placeholder='Hotel Name or Expedia Id...'
                    value={inputValue}
                    onChange={onInputChangeHandler}
                    onKeyDown={onEnter && onInputKeyDownHandler} />
                <SearchIcon className='search-icon' />
                <span className='clear-icon' onClick={onClearHandler}>x</span>
            </div>
            {isValueSearch && 
            <div className="results-section">
                {loading ? <CircularProgress style={{marginTop: "1.1rem"}} /> : results.errorDetail ? (
                    <span className='results-error'>{results.errorDetail}</span>           
                ) : (
                    <ul className='results-list'>
                        {results.map((item) =>
                            <li key={item.id} onClick={() => {onItemClickHandler(item)}}>
                                <h4>{item.hotel_name}</h4>
                                <span>{item.address}</span>
                                <span>{item.city}, {item.country_name}</span>
                                <span>{`OTA id: ${item.id} | Expedia id: ${item.expedia_id}`}</span>
                            </li>
                        )}
                    </ul>
                )}
            </div>}
            {selected && 
            <div className='selected-section'>
                {selected.map((item) =>
                    <div className="selected-items" key={item.id}>
                        <ClearIcon 
                            fontSize='small'
                            style={{cursor: "pointer"}}
                            onClick={() => onClearItemHandler(item.id)} />
                        <span className='item'>{item.hotel_name}</span>
                    </div>)}
            </div>}
        </div>
    );
}

export default MultiOption;