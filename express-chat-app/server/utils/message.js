var generateMessage = (from, text,currentUserCount) => { 
  return {
	  from,
	  text,
	  createdAt: new Date().getTime(),
      currentUserCount	  
  };
};



var generateLocationMessage = (from, latitude,longitude) => { 
  return {
	  from,
	  url: `https://www.google.com/maps?q${latitude},${longitude}`,
	  createdAt: new Date().getTime(), 
  };
};

module.exports = { generateMessage,generateLocationMessage };