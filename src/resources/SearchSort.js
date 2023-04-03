/**
 * @param  { String } value string to search for
 * @param  { List } options list of strings to search
 *
 * @returns { List } a list of ordered relevant results
 */
export function searchSort(value, options) {
  let scoreMap = {};
  for (let i in options) {
    let phraseScore = {};
    const words = options[i].toLowerCase().split(" ");
    const inputs = value.toLowerCase().split(" ");
    for (let d = 0; d < words.length; d++) {
      for (let e = 0; e < inputs.length; e++) {
        let target = words[d];
        let current = inputs[e];
        let wordScore = 0;
        let consc = 0;
        for (let j = 0; j < current.length; j++) {
          let cdif = target.indexOf(current.toLowerCase()[j]);
          if (cdif > 2) {
            cdif = -1;
          }
          if (cdif === 0) {
            if (target === words[d]) {
              consc++;
            }
            consc++;
          } else {
            consc -= cdif;
            if (cdif === -1) {
              consc -= 3;
            }
          }
          if (!(cdif === -1)) {
            wordScore -= consc;
            target = target.slice(cdif + 1);
          }
        }
        if (current.length > 2) {
          wordScore += target.length;
        }
        wordScore -= consc;

        // Change wordScore to a percentage
        const n = words[d].length;
        // const maxScore = n**2 * (n+1)**2 / 4
        wordScore = wordScore / n;

        // Phrasescore = {List}
        // = {keyword index: score}
        phraseScore[`a${d},b${e}`] = wordScore;
      }
    }
    const rank = Object.keys(phraseScore)
      .sort()
      .sort((a, b) => phraseScore[a] - phraseScore[b]);
    let scores = phraseScore[rank[0]];
    let avoid = [];
    for (let i in rank) {
      const k = rank[i].split(",");
      let flag = false;
      for (let j in k) {
        if (avoid.includes(k[j])) {
          flag = true;
        }
      }
      if (!flag) {
        scores += phraseScore[rank[i]];
        avoid = avoid.concat(k);
      }
    }
    const total = scores;
    if (total <= 0) {
      scoreMap[options[i]] = total;
    }
  }
  return Object.keys(scoreMap)
    .sort()
    .sort((a, b) => scoreMap[a] - scoreMap[b]);
}
