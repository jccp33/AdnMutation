// this function converts columns to rows and returns them as a new matrix
function changeRowsCols(array){
    let new_array = [];
    for(let i=0; i<array.length; i++){
        let str = "";
        for(let j=0; j<array[i].length; j++){
            str += array[j][i];
        }
        new_array.push(str);
    }
    return new_array;
}

// this function converts the diagonals to rows and returns them as a new matrix
function diagonalStrings(array){
    let str1 = "";
    let str2 = "";
    for(let i=0; i<array.length; i++){
        for(let j=0; j<array[i].length; j++){
            if(i === j){
                let char_d1 = array[i][j];
                let char_d2 = array[i][array[i].length-1 - i];
                str1 += char_d1;
                str2 += char_d2;
            }
        }
    }
    return [str1, str2];
}

// this function validates the characters of the DNA sequence
function validNitrogenousBases(array){
    for(let i=0; i<array.length; i++){
        for(let j=0; j<array[i].length; j++){
            if(array[i][j] !== 'A' && array[i][j] !== 'T' && array[i][j] !== 'C' && array[i][j] !== 'G'){
                return false;
            }
        }
    }
    return true;
}

// this function returns the total of sequences of characters repeated four or more times
function horizontalSequences(array){
    let sequences = 0;
    for(let line=0; line<array.length; line++){
        let str = array[line];
        let i = 0;
        while(str.length-i >= 4){
            let seq = "";
            let char = str[i];
            let count = 0;
            for(let j=i; j<str.length; j++){
                seq += str[j];
                if(str[j] === char){
                    count++;
                }else{
                    break;
                }
            }
            if(count === 4){
                sequences++;
            }
            i++;
        }
    }
    return sequences;
}

// this function returns if a DNA sequence has a mutation
function hasMutation(array){
    if( !validNitrogenousBases(array) )
        return {response:403, text:"Forbidden", message:"Invalid Nitrogenous Bases"};
    
    let sequences_four_equal = horizontalSequences(array);
    if(sequences_four_equal > 1){
        return {response:200, text:"OK", message:"Contains Mutations"};
    }

    let new_array = changeRowsCols(array);
    sequences_four_equal += horizontalSequences(new_array);
    if(sequences_four_equal > 1){
        return {response:200, text:"OK", message:"Contains Mutations"};
    }

    new_array = diagonalStrings(array);
    sequences_four_equal += horizontalSequences(array);
    if(sequences_four_equal > 1){
        return {response:200, text:"OK", message:"Contains Mutations"};
    }

    return {response:403, text:"Forbidden", message:"Do not Contains Mutations"};
}

// this function returns an array of strings from dividing a string by line_len
function arrayOfStrings(str, line_len){
	let array = [];
	let sections = str.length / line_len;
	for(let i=0; i<sections; i++){
		array.push(str.substring(i*line_len, i*line_len+line_len));
	}
	return array;
}

// export required functions
module.exports = {
    hasMutation: hasMutation,
    arrayOfStrings: arrayOfStrings
};
