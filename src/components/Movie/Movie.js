import React, { Component } from "react";
import Actor from "../elements/Actor/Actor";
import { API_URL, API_KEY } from "../../config";
import Navigation from "../elements/Navigation/Navigation";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Spinner from "../elements/Spinner/Spinner";
import "./Movie.css";

class Movie extends Component {
  // هاخد داتا يبقى احفظها في state
  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false,
  };

  componentDidMount() {
    if (localStorage.getItem(`${this.props.match.params.movieId}`)) {
      const state = JSON.parse(localStorage.getItem("MoveState"));
      this.setState({ ...state });
    } else {
      this.setState({
        loading: false,
      });
      // first fetch the movie you have clicked on
      let endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`;
      this.fetchItems(endpoint);
    }
  }

  fetchItems = (endpoint) => {
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        // means if there is ala2
        if (result.status_code) {
          this.setState({
            loading: false,
          });
        } else {
          console.log(result);
          this.setState(
            {
              movie: result,
            },
            // we'll need to fetch again to get actors, this will happen as callback funciton after you put result to movie
            () => {
              // this how we get props from from Link
              const endpoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}&language=en-US`;
              // data if the movie i clicked
              console.log(this.props);

              fetch(endpoint)
                .then((result) => result.json())
                .then((result) => {
                  const directors = result.crew.filter(
                    (member) => member.job === "Director"
                  );
                  this.setState(
                    {
                      actors: result.cast,
                      directors,
                      loading: false,
                    },
                    () => {
                      localStorage.setItem(
                        `${this.props.match.params.movieId}`,
                        JSON.stringify(this.state)
                      );
                    }
                  );
                  console.log(result);
                });
            }
          );
        }
      });
  };

  render() {
    return (
      <div className="rmdb-movie">
        {this.state.movie ? (
          <div>
            <Navigation movie={this.state.movie} />
            <MovieInfo
              movie={this.state.movie}
              directors={this.state.directors}
            />
            <MovieInfoBar
              time={this.state.runtime}
              budget={this.state.budget}
              revenue={this.state.revenue}
            />
          </div>
        ) : null}
        {this.state.actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={"actors"}>
              {this.state.actors.map((element, i) => {
                return <Actor key={i} actor={element} />;
              })}
            </FourColGrid>
          </div>
        ) : null}
        {!this.state.actors && this.state.loading ? (
          <h1>no movie found</h1>
        ) : null}
        {this.state.loading ? <Spinner /> : null}
      </div>
    );
  }
}

export default Movie;
