var generateMessage = (from, text,currentUserCount) => { 
  return {
	  from,
	  text,
	  createdAt: new Date().getTime(),
      currentUserCount	  
  };
};

module.exports = { generateMessage };