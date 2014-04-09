/* 
	nhce.js
	nhce辅助
	For 苏文. 2012/06/04
 */

function nhce_main(){
	if (!inUrl("202.120.59.230"))
        return 0;
		

	answer03 = {"1": {"1": ["C", "D", "A", "D", "B", "A", "D", "C", "A", "B"], "2": ["A", "C", "B", "B", "D"], "3": ["B", "A", "C", "C", "C"], "4": ["a journalism degree", "pretty good", "about what she has", "you just want more", "protective of his family"], "5": ["C", "C", "A", "D", "B"], "6": ["A", "C", "D", "C", "D"], "7": ["slice", "misunderstandings", "beautiful", "benefits", "wellness", "range", "explicit", "has been tracking more than a million subjects since 1979", "have fewer heart attacks and lower cancer rates", "a strong sense of connection to others and in satisfying relationship"]}, "2": {"1": ["C", "C", "B", "A", "D", "B", "C", "D", "A", "A"], "2": ["D", "C", "A", "B", "A"], "3": ["B", "D", "D", "C", "A"], "4": ["the quality of school menus", "moving into the neighbourhood", "eats fast food", "the Chicago study", "children's eating habits"], "5": ["A", "B", "C", "D", "B"], "6": ["A", "B", "D", "C", "D"], "7": ["advancements", "physical", "depression", "condition", "mentioned", "admit", "combat", "high-fiber and vitamin-rich foods, such as vegetables and fruits", "should give up smoking if they haven't already done so", "No section of the population can benefit from exercise."]}, "3": {"1": ["D", "C", "B", "C", "C", "B", "A", "C", "B", "A"], "2": ["B", "C", "A", "B", "D"], "3": ["A", "B", "A", "C", "A"], "4": ["is studying for a doctorate in religion", "is marked by chance encounters", "only knew a little Italian", "was attacked by an intruder in her home", "began to live a life with vivid moments"], "5": ["C", "D", "D", "A", "B"], "6": ["B", "B", "C", "D", "B"], "7": ["experience", "indicate", "distinguish", "Successful", "long-term", "achievements", "follow", "unsuccessful people just let life happen by accident", "and they aren't difficult for people to attain", "what to go after and in what direction to aim your life"]}, "4": {"1": ["B", "B", "C", "D", "A", "B", "D", "C", "D", "A"], "2": ["C", "D", "B", "B", "A"], "3": ["B", "A", "D", "D", "B"], "4": ["for decades", "healthy and active lifestyle", "meet consumer demands","spur competitiveness"], "5": ["D", "C", "C", "B", "B"], "6": ["C", "A", "B", "D", "B"], "7": ["studios", "counterparts", "emphasize", "innovation", "specialized", "energized", "filmmakers", "They began playing with and contradicting the conversations of Hollywood", "Furthermore, their considerable financial success and crossover into popular culture", "Some people have taken advantage of this rise in popularity"]}, "5": {"1": ["B", "C", "D", "A", "B", "B", "B", "A", "D", "D"], "2": ["B", "C", "D", "D", "A"], "3": ["A", "C", "B", "C", "C"], "4": ["do it at pains", "I love you", "their appearance", "you don't want to answer", "think of her in your heart"], "5": ["D", "A", "A", "B", "C"], "6": ["B", "D", "C", "A", "A"], "7": ["Yet", "elaborated", "outward", "kneel", "embarrassed", "express", "gathered", "but over time, I started to enjoy them more and more", "Now that I've talked to you, I feel ten years younger.", "people shouldn't live their lives always thinking about the past."]}, "6": {"1": ["D", "D", "D", "B", "C", "A", "C", "C", "A", "C"], "2": ["A", "C", "B", "B", "D"], "3": ["C", "D", "C", "D", "A"], "4": ["Islamabad", "a tall Islamabad building", "the Kashmirian Mountains", "a heavily militarized region", "India"], "5": ["A", "B", "C", "D", "A"], "6": ["A", "A", "B", "D", "A"], "7": ["thickness", "frightened", "swallowed", "disappeared", "floods", "revisit", "landslide", "keep us away from mountains the rest of our lives", "something like the Yellowstone earthquake does not happen very often", "few of us will suffer because of such a disaster."]}, "7": {"1": ["C", "A", "C", "B", "D", "A", "B", "B", "A", "C"], "2": ["A", "B", "B", "C", "D"], "3": ["A", "A", "D", "C", "B"], "4": ["The Day to Day", "To try to go after the online music business", "Apple", "It has been negotiating licenses for songs", "Gate's leaving will benefit it"], "5": ["D", "C", "D", "D", "A"], "6": ["D", "C", "B", "C", "A"], "7": ["industry", "option", "preferable", "starve", "blame", "occupations", "force", "But if we admit tradition more than we should", "insist on trying to plot the future by the past", "to accept the help which tradition can bring"]}, "8": {"1": ["B", "D", "C", "A", "A", "A", "C", "C", "A", "B"], "2": ["A", "A", "D", "D", "C"], "3": ["D", "C", "A", "B", "C"], "4": ["human beings", "maternal twins", "genes that cause disease", "manny disease", "an environmental component"], "5": ["B", "C", "B", "C", "D"], "6": ["C", "A", "B", "C", "C"], "7": ["ethics", "prediction", "technique", "adapted", "artificial", "urgent", "inconsistencies", "\"Genetic engineering is very exciting and important technology\"", "but you have to ask fundamental questions before it is too late", "the way the technology is racing far ahead of public understanding"]}, "9": {"1": ["B", "D", "A", "C", "A", "B", "C", "C", "D", "D"], "2": ["A", "B", "D", "C", "D"], "3": ["D", "D", "A", "C", "A"], "4": ["her benefits were fabulous", "really, really tough", "got a part-time job", "on the Internet/online", "lazy"], "5": ["C", "A", "B", "B", "C"], "6": ["D", "C", "C", "C", "B"], "7": ["university", "expect", "marriage", "mature", "exaggerating", "Undergraduates", "candidates", "The answer to whether or not marriage in school should be allowed.", "As for those who are attending universities at an older age.", "the marriage of some undergraduates will inevitably influence  other students"]}, "10": {"1": ["A", "B", "B", "C", "D", "A", "B", "D", "C", "D"], "2": ["B", "D", "C", "A", "C"], "3": ["A", "C", "B", "D", "A"], "4": ["in 1776", "They worked together for the same goal", "Fifty years", "No ,he was ailing", "Yes, they did."], "5": ["C", "A", "B", "D", "B"], "6": ["D", "A", "A", "D", "B"], "7": ["organisms", "untreated", "occurences", "agriculture", "encouraged", "administrations", "attributed", "Some things have been done to address this problem", "in an effort to raise the public's awareness of environmental protection", "to punish enterprises that drain untreated wastes into the rivers and oceans"]}};
	
	answer04 = {"1": {"1": ["A", "C", "B", "B", "D", "B", "A", "C", "C", "D"], "2": ["A", "B", "A", "C", "B"], "3": ["A", "A", "D", "B", "C"], "4": ["married in St. Paul's Cathedral", "was a guest at the wedding ceremony", "wore a hat with flowers at the wedding", "is remembered as having been naughty", "was one of the designers of the wedding dress"], "5": ["D", "A", "B", "B", "A"], "6": ["C", "A", "B", "B", "A"], "7": ["shortage", "assigned", "centered", "hospitalization", "treatment", "colleague", "decentralized", "There are nurse-managers instead of head-nurses", "decide among themselves who will work what shifts and when", "an equal with other vice presidents of the hospital"]}, "2": {"1": ["D", "D", "D", "C", "B", "A", "A", "B", "C", "D"], "2": ["D", "A", "B", "B", "A"], "3": ["B", "C", "D", "A", "C"], "4": ["C", "A", "A", "C", "D"], "5": ["D", "A", "B", "B", "A"], "6": ["B", "D", "A", "C", "A"], "7": ["sketch", "shadow", "paintings", "abroad", "Europe", "jewels", "exquisite", "pictures of rooms with handsomely dressed people in them", "not just their clothes or the lines of their faces", "but he was far greater than they would ever become"]}, "3": {"1": ["C", "D", "C", "B", "B", "B", "A", "C", "A", "B"], "2": ["A", "B", "D", "C", "B"], "3": ["A", "B", "D", "B", "C"], "4": ["An Australian scientist who won the Nobel Prize.", "The mysterious field of infectious diseases.", "By accident.", "It was probably extremely significant.", "He couldn't handle all that."], "5": ["B", "C", "A", "D", "C"], "6": ["B", "A", "C", "B", "C"], "7": ["September", "retire", "retirement", "reduction", "practical", "pensions", "leisure", "The club arranges discussion groups and handicraft sessions", "a member can attend any course held there free of charge", "the financial section on Mondays and Wednesdays between six and eight p.m."]}, "4": {"1": ["B", "A", "D", "D", "A", "D", "C", "C", "A", "A"], "2": ["C", "B", "B", "B", "C"], "3": ["A", "C", "B", "A", "C"], "4": ["became Bill Gates' greatest contribution", "makes use of Gates' system", "was the plaything of nerds", "became a business tool", "made it a wish to dominate like Bill Gates", "was not fit to comment on upcoming innovation"], "5": ["B", "A", "B", "C", "A"], "6": ["A", "A", "B", "B", "A"], "7": ["fundamental", "dramatically", "majority", "workplace", "self-employed", "breadth", "notions", "its applications in personal computers, digital communications, and factory robots", "still unimagined technology could produce a similar wave of dramatic changes", "will have the greatest advantage and produce the most wealth"]}, "5": {"1": ["A", "D", "D", "D", "B", "C", "D", "C", "A", "D"], "2": ["B", "B", "A", "C", "C"], "3": ["D", "A", "B", "B", "A"], "4": ["how they are turning men off", "an idea in one's head about what the perfect man looks like", "a much younger version of yourself", "more advice on dating and relationships", "burning the perfect man checklist"], "5": ["C", "D", "A", "B", "D"], "6": ["A", "C", "A", "C", "D"], "7": ["emerging", "residents", "participants", "companionship", "soldiers", "isolated", "extraordinary", "who happen to live by themselves die at twice the rate of those live with others", "It's clear that reaching out to others can help our bodies thrive", "only 5 percent of U.S. households consisted of one person living alone"]}, "6": {"1": ["C", "B", "C", "D", "B", "C", "A", "D", "D", "B"], "2": ["A", "B", "C", "C", "D"], "3": ["C", "D", "D", "A", "B"], "4": ["Centennial Olympic Park", "North Cardwell, New Jersey", "Oklahoma City, Oklahoma", "the FBI laboratories", "ground zero", "an Atlanta abortion clinic"], "5": ["D", "C", "B", "A", "A"], "6": ["C", "B", "C", "A", "D"], "7": ["impeach", "scandal", "gambling", "Representatives", "accusations", "procedures", "opposition", "resigned as Secretary of Social Welfare and urged the President to resign", "five economic advisers to the President have resigned", "the Judicial Committee and Economic Affairs Committee in the House of Representatives"]}, "7": {"1": ["B", "C", "A", "A", "D", "C", "B", "D", "A", "B"], "2": ["D", "A", "C", "C", "B"], "3": ["C", "C", "D", "B", "B"], "4": ["shows God's part in creating the universe", "shows the existence of a man thousands of years ago", "shows messages inscribed in DNA", "shows a court opinion against Intelligent Design", "shows God's existence"], "5": ["D", "D", "A", "B", "B"], "6": ["A", "C", "B", "A", "D"], "7": ["would-be", "intelligence", "genes", "athletic", "medical", "disclosed", "consideration", "the sum American egg donors expect to be paid", "plus all the costs of medical treatment and insurance", "almost half the cost of fees for the students\u2019 four-year college course."]}, "8": {"1": ["C", "A", "A", "B", "C", "D", "D", "A", "C", "B"], "2": ["D", "A", "A", "B", "A"], "3": ["D", "A", "B", "B", "A"], "4": ["Bill Gates", "Warren Buffet", "KP Singh", "Martha Stewart", "Ronald Lauder", "Luisa Kroll"], "5": ["A", "C", "D", "B", "C"], "6": ["A", "D", "B", "B", "B"], "7": ["greeted", "freshman", "spite", "fluke", "agitated", "faculty", "particularly", "I had the highest average in the freshman class", "Then, she took out a copy of the examination paper", "I was so angry that I started punding her"]}, "9": {"1": ["A", "C", "B", "D", "C", "D", "A", "A", "B", "C"], "2": ["D", "A", "B", "B", "A"], "3": ["D", "B", "B", "C", "C"], "4": ["His brother's two daughters.", "They drove there.", "Children under three.", "They watched the parade.", "He sat down and had a rest for a few minutes."], "5": ["C", "B", "A", "C", "D"], "6": ["B", "A", "D", "C", "B"], "7": ["Authorities", "grant", "opera", "not traditional", "staged", "journalists", "tunnel", "Critics, performers and audience alike were especially excited about the new introduction to the story", "who kills all suitors who cannot answer her three riddles", "Some Chinese critics have complained that the princess has none of the grace of a true Chinese lady"]}, "10": {"1": ["D", "B", "A", "C", "B", "B", "B", "C", "B", "A"], "2": ["D", "B", "C", "A", "B"], "3": ["C", "B", "D", "D", "A"], "4": ["is something not known for sure", "is trying to figure out how dreams help in solving problems", "is something everyone should do", "is important in interpreting dreams", "is something a person might be afraid of"], "5": ["C", "D", "C", "A", "A"], "6": ["A", "D", "C", "B", "A"], "7": ["rarely", "consulting", "renting", "agent", "appointment", "exchange", "praises", "the people who work there actually know where things are and they'll take you right to them", "I will tell you what I really like about Publix", "There's a different grocery store near my house, but all that the employees do there is to grunt"]}};
	
	pattern = new RegExp(".*?book/book25/dj(.*?).php\\?UnitID=(\\d*).*","ig");
	matches = pattern.exec(document.URL);
//	console.log(matches);
	
	if(matches != undefined && matches.length == 3)
		nhce_fill_blank_3(matches[1],matches[2]);
	
	pattern = new RegExp(".*?book/book26/dj(.*?).php\\?UnitID=(\\d*).*","ig");
	matches = pattern.exec(document.URL);
//	console.log(matches);
	
	if(matches != undefined && matches.length == 3)
		nhce_fill_blank_4(matches[1],matches[2]);

	if(document.URL.indexOf("dj24.php") > 0)
		jQuery(".next").attr("href",jQuery(".next").attr("href").replace("dj33.php","dj51.php"));
	/*
	if(document.URL.indexOf("dj53.php") > 0){
		jQuery(".next").attr("href",jQuery(".next").attr("href").replace("dj56.php","dj21.php"));
		jQuery(".next").attr("href",jQuery(".next").attr("href").replace("UnitID="+matches[2],"UnitID="+String(Number(matches[2])+1)));

	}*/
    jQuery(document).keydown(function(){
        if(window.event.keyCode == 78)
            jQuery(".next")[0].click();

    });
    jQuery("body").attr("onkeydown","javascript: if(window.event.keyCode==83)djSubmit();");
	
	
}

function nhce_fill_blank_3(part,unit){
	// Listening - Short Conversation
	if(part == "21"){
		var kid = 1;
		pattern = new RegExp(".*KidID=(\\d*).*","ig");
		matches = pattern.exec(document.URL);
		if(matches != undefined && matches.length == 2)
			kid = Number(matches[1]);
		
		console.log("kid:");
		console.log(kid);
		
		console.log("answer:");
		ans = answer03[unit]["1"][kid-1];
		console.log(ans);
		jQuery("input[value="+ans+"]").attr("checked","checked");
		jQuery("input[value="+ans+"]").parent().parent().css("background-color","yellow");
		
        return;

	}
    
    // Listening - Long Conversation
	if(part == "22"){

		console.log("answer:");
		ans = answer03[unit]["2"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            var start_id = Number(jQuery("input[type=radio]").slice(0,1).attr("name").slice(5));
            radio = jQuery("#Item_"+String(start_id-1+x)+"_"+ans[x-1]);
            radio.attr("checked","checked");
            radio.parent().parent().css("background-color","yellow");
        }
        return;
    }    
    // Listening - Passage
	if(part == "23"){

		console.log("answer:");
		ans = answer03[unit]["3"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            var start_id = Number(jQuery("input[type=radio]").slice(0,1).attr("name").slice(5));
            radio = jQuery("#Item_"+String(start_id-1+x)+"_"+ans[x-1]);
            radio.attr("checked","checked");
            radio.parent().parent().css("background-color","yellow");
        }
        return;
    }  
    
    // Listening - Radio Program
	if(part == "24"){

		console.log("answer:");
		ans = answer03[unit]["4"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            radio = jQuery("input[name=Item_"+String(x-1)+"]");
            radio.val(ans[x-1]);
            radio.css("background-color","yellow");
        }
        return;
    }  
    
    // Homework - Long Conversation
	if(part == "51"){

		console.log("answer:");
		ans = answer03[unit]["5"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            radio = jQuery("#Item_"+String(0+x)+"_"+ans[x-1]);
            radio.attr("checked","checked");
            radio.parent().parent().css("background-color","yellow");
        }
        return;
    }    
    // Homework - Passage
	if(part == "52"){

		console.log("answer:");
		ans = answer03[unit]["6"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            radio = jQuery("#Item_"+String(0+x)+"_"+ans[x-1]);
            radio.attr("checked","checked");
            radio.parent().parent().css("background-color","yellow");
        }
        return;
    }    

    // Homework - Compound Dictation
	if(part == "53"){

		console.log("answer:");
		ans = answer03[unit]["7"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            radio = jQuery("input[name=Item_"+String(x-1)+"]");
            radio.val(ans[x-1]);
            radio.css("background-color","yellow");
        }
        return;
    }  

    


}


function nhce_fill_blank_4(part,unit){
	// Listening - Short Conversation
	if(part == "21"){
		var kid = 1;
		pattern = new RegExp(".*KidID=(\\d*).*","ig");
		matches = pattern.exec(document.URL);
		if(matches != undefined && matches.length == 2)
			kid = Number(matches[1]);
		
		console.log("kid:");
		console.log(kid);
		
		console.log("answer:");
		ans = answer04[unit]["1"][kid-1];
		console.log(ans);
		jQuery("input[value="+ans+"]").attr("checked","checked");
		jQuery("input[value="+ans+"]").parent().parent().css("background-color","yellow");
		
        return;

	}
    
    // Listening - Long Conversation
	if(part == "22"){

		console.log("answer:");
		ans = answer04[unit]["2"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            var start_id = Number(jQuery("input[type=radio]").slice(0,1).attr("name").slice(5));
            radio = jQuery("#Item_"+String(start_id-1+x)+"_"+ans[x-1]);
            radio.attr("checked","checked");
            radio.parent().parent().css("background-color","yellow");
        }
        return;
    }    
    // Listening - Passage
	if(part == "23"){

		console.log("answer:");
		ans = answer04[unit]["3"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            var start_id = Number(jQuery("input[type=radio]").slice(0,1).attr("name").slice(5));
            radio = jQuery("#Item_"+String(start_id-1+x)+"_"+ans[x-1]);
            radio.attr("checked","checked");
            radio.parent().parent().css("background-color","yellow");
        }
        return;
    }  
    
    // Listening - Radio Program
	if(part == "24"){

		console.log("answer:");
		ans = answer04[unit]["4"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            radio = jQuery("input[name=Item_"+String(x-1)+"]");
            radio.val(ans[x-1]);
            radio.css("background-color","yellow");
        }
        return;
    }  
    
    // Homework - Long Conversation
	if(part == "51"){

		console.log("answer:");
		ans = answer04[unit]["5"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            radio = jQuery("#Item_"+String(0+x)+"_"+ans[x-1]);
            radio.attr("checked","checked");
            radio.parent().parent().css("background-color","yellow");
        }
        return;
    }    
    // Homework - Passage
	if(part == "52"){

		console.log("answer:");
		ans = answer04[unit]["6"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            radio = jQuery("#Item_"+String(0+x)+"_"+ans[x-1]);
            radio.attr("checked","checked");
            radio.parent().parent().css("background-color","yellow");
        }
        return;
    }    

    // Homework - Compound Dictation
	if(part == "53"){

		console.log("answer:");
		ans = answer04[unit]["7"];
        console.log(ans);
        for(x = 1; x <= ans.length; x++){
            radio = jQuery("input[name=Item_"+String(x-1)+"]");
            radio.val(ans[x-1]);
            radio.css("background-color","yellow");
        }
        return;
    }  

    


}