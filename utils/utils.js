function shareLinkGenerator(domain, urlpath){
  const environment = process.env.NODE_ENV || 'development';
  console.log(`running in the ${environment} mode`);
  console.log(domain+urlpath);
  console.log("this should be the last thign to run")
  return domain + urlpath;
}


module.exports = {
  shareLinkGenerator,
};
