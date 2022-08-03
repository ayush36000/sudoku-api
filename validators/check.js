const toFindDuplicates= (arr) => {
    let toMap = {};
    for (item of arr) {

        if (toMap[item]) {
            return true
        }

        toMap[item] = true;
    }
    return false
}

const hasDuplicate = (arr) => {
    for (index in arr){
        
        console.log(arr[index], index, arr.slice(index+1,), arr)

        if (arr[index] !== '-' && arr.slice(index+1,).includes(arr[index])){
            //returns true if duplicate value found
            return true
        }
    }
    return false
}

module.exports = {toFindDuplicates, hasDuplicate}