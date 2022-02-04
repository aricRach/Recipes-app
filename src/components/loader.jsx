
import { BallTriangle } from  'react-loader-spinner'

const Loader = props => {

    return (   <div className="loader">
    <BallTriangle color="#00BFFF"  heigth="100" width="100" color='grey' arialLabel='loading' />
    </div>
    )
}

export default Loader;
