
import { BallTriangle } from  'react-loader-spinner'

const Loader = props => {

    return (   <div className="loader">
    <BallTriangle heigth="100" width="100" color='grey' arialLabel='loading' />
    </div>
    )
}

export default Loader;
