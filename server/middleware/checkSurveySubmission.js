

const isAlreadySubmitted = (req, res, next) => {

    console.log('inner checkSurveySubmssion middleware');

    const user = req.user;

    // :TODO check the user already submitted or not
    if(user.role == 'User') {

    }
    else {

    }

}