import {textGeneration} from "@huggingface/inference";
async function name() {
  const apps_list=[{
    app_name:"dummy_alarm",
    app_description:"Use this app when the user asks you to set an alarm. This app takes HH:MM as arguments"
  }]
  const user_input="set an alarm at 8:00"
  const prompt=`you are a probability calculator math app. Given the task ${user_input}, which app is most suitable: ${JSON.stringify(apps_list)}? Please reply in the format: app_name:probability. remember that you do not need to write any code or do anything except comparing the giving task with giving app list name and description.
  you must reply in this format app_name:prob.
  `
  console.log("prompt", prompt)
    const re =await textGeneration({
        accessToken: "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",
        model: "stabilityai/stablelm-base-alpha-7b", 
     
        inputs: prompt,
        parameters: {
          temperature: 0.9,
          top_p: 0.95,
          repetition_penalty: 1.2,
          top_k: 50,
          truncate: 1000,
          max_new_tokens: 1024,
			  return_full_text: false,
        },
      });
      console.log(re.generated_text)
}
name()