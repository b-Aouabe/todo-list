

exports.getDate = function (){
    const now = new Date()
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"

    }

   return now.toLocaleString("en-US", options)
}

exports.getDay = function (){
    const now = new Date()
    const options = {
        weekday: "long"
    }

    return now.toLocaleString("en-US", options)
}