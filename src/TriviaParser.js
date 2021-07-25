const fs = require("fs")
var answers = fs.readFileSync(__dirname + "/../config/answers.json")
const logger = require('./utility/logger')
answers = JSON.parse(answers)
module.exports = {
    convert_embed: async function(embed, channel) {
      let response = await channel.awaitMessages(m => m.author.id === '866377110448373761', {
        max: 1,
        time: 30000,
        errors: ['time']
      })
      response = response.first()
      let converted_object = {}
      converted_object[get_question()] = {difficulty: embed.fields.find( ({ name }) => name.includes('Difficulty') ).value.replace(/`/g, "").toLowerCase(), category: embed.fields.find( ({name}) => name.includes("Category")).value.replace(/`/g, ""), incorrect_answers: this.get_possible_answers(embed.description)}
      let {content} = response
    
      if (content.endsWith('`')) {
        converted_object['correct_answer'] = content.substring(content.indexOf('`')).slice(0, -1)
        converted_object['incorrect_answers'].filter(data => data != converted_object['correct_answer'])
      }
      console.log(converted_object)
      return converted_object
    },
    get_possible_answers: async function(description) {
      let starting_chars = ['A', 'B', 'C', 'D']
      let possible_answers = []
      for(var i of description.split('\n')) {
        let answer = false
        starting_chars.forEach((char) => {if (i.startsWith(char)) answer = true;})
        if (answer) possible_answers.push(i.substring(3).replace("_", "").replace("_", "").trim());
      }
      return possible_answers
    },
    get_question: async function (embed) {
        return embed.description.split('\n')[0].replace("**", "").replace("**", "")
    },
    get_answer: async function (question, embed) {
        try {
            //logger.log("» Generating question for: " + question)
            //console.log(embed)
            if (embed.description == undefined) {
              embed = embed.embeds[0]
            }
            if (answers[question] === undefined || answers[question] == null) return ["a", "b", "c", "d"][Math.floor(Math.random() * 4)];
            var answer = undefined
            //console.log(answers[question].correct_answer.toLowerCase())
            //console.log(embed.description.split("\n"))
            for(var line in embed.description.split("\n")) {
                line = embed.description.split("\n")[line]
                line = line.replace(/\_/g)
                //console.log(answers[question].correct_answer, line)
                if (line.includes(answers[question].correct_answer)) {
                    answer = line.charAt(0).toLowerCase()
                }
            }

            return answer || ["a", "b", "c", "d"][Math.floor(Math.random() * 4)];
        }
        catch(e) {
            logger.error(JSON.stringify(e))
            return ["a", "b", "c", "d"][Math.floor(Math.random() * 4)];
        }
        
    }
}