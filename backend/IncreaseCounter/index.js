module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
      }
      
    let randomNumber = getRandomInt(500, 999);

    context.res = {
        body: randomNumber
    };
}