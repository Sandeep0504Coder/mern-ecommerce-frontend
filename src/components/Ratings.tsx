import { useRating } from "6pp"
import { FaRegStar, FaStar } from "react-icons/fa";

const RatingsComponent = ( { value = 0 }: { value: number } ) => {
    const { Ratings } = useRating({IconFilled:<FaStar/>, IconOutline: <FaRegStar/>, value, styles: {
        fontSize: "1.5rem",
        color: "coral",
        justifyContent: "flex-start"
    }});
  return <Ratings/>
}

export default RatingsComponent;