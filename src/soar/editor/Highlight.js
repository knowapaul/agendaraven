export function getPeopleHighlight(person, uProps) {
  // Check for times in the availability
  // TODO: Make this more universal for other formats
  let begin;
  let end;
  try {
    begin = new Date();
    end = new Date();

    let iBegin = uProps.avs[person][uProps.title]["Start Time"].split(":");
    let iEnd = uProps.avs[person][uProps.title]["End Time"].split(":");

    // Convert to acutal date times
    begin.setHours(iBegin[0], iBegin[1], 0, 0);
    end.setHours(iEnd[0], iEnd[1], 0, 0);
  } catch (typeError) {
    console.log("typerror");
  }

  if (uProps.items[0]) {
    const highlight = uProps.items.map((row) => {
      if (row["Time"]) {
        let tString = row["Time"].split(":");
        let rowTime = new Date();
        rowTime.setHours(tString[0], tString[1], 59, 0);

        // console.log('begin', begin)
        // console.log('rowTime', rowTime)
        // console.log('end', end)
        if (begin <= rowTime && rowTime < end) {
          return "green";
        } else {
          return "red";
        }
      }
      return "gray";
    });
    return highlight;
  }
  return [];
}
