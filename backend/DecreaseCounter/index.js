module.exports = async function (context, req) {
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
      }
      
    let randomNumber = getRandomInt(1, 499);

    context.res = {
        body: randomNumber
    };
}