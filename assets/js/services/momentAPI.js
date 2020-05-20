import moment from 'moment'

// récupère une date et la formate
function dayMonthYears(str) {
    return moment(str).format('DD/MM/YYYY'); 
}

function monthYears(str){
    return moment(str).format('MM/YYYY'); 
}

export default {
    dayMonthYears,
    monthYears
}