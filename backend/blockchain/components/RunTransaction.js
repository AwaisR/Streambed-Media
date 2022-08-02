import config from '../../oip.config.js';
import Wallet from '../helpers/OipWallet.js';

import RecordCompiler from '../oipComponents/RecordCompiler.js';
import RecordPublisher from '../oipComponents/RecordPublisher.js';

let recordCompiler = new RecordCompiler();
let recordPublisher = new RecordPublisher();


class RunTransaction extends React.Component {
    
    // This file is not being used. I made it for testing


    outputRecord() {
        let updatedPaylod = recordCompiler.upDatePayloads()
        console.log(updatedPaylod + "")
    }

    render() {
        return(
            <div>
                RunTransaction
            </div>
        )
    }

}

export default RunTransaction;


//{this.outputRecord}