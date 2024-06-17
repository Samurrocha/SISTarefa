import moment from "moment";

class paginaIncial {

    render(req, res) {

        const formattedDateTime = moment().format('DD/MM/YYYY - HH:mm');
        res.render('index', {name: 'visitante', dateTime: formattedDateTime});
        
            
        };

    }



export default new paginaIncial();