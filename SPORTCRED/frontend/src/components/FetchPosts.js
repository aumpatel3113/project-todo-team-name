import React from "react";
import './FetchPosts.css';
import axios from 'axios'
import Slider from './RatingSlider';
import { findAllInRenderedTree } from "react-dom/test-utils";

class FetchPosts extends React.Component {
    constructor(props) {

        super(props);

        // groupInfo[0] indicates whether a group exists
        // groupInfo[1] is the question being answered by the group
        const groupInfo = [1]

        const posts = [];
        const url = 'http://localhost:8080/api/v1/sendDebateGroup'
        const headers = {
            'Content-Type': 'text/plain',
        }

        axios.post(url, { 'username': btoa(sessionStorage.getItem('username')) }, { headers }
        )
            .then(res => {
                let debateGroup = res.data.postGroup;

                if (debateGroup.length > 0) {
                    groupInfo.push(debateGroup[0].question)
                    for (let i = 0; i < debateGroup.length; i++) {

                        posts.push({
                            username: atob(debateGroup[i].user),
                            question: debateGroup[i].question,
                            post: debateGroup[i].post,
                            overallRating: Math.round(debateGroup[i].scores),
                            rating: 50,
                        });
                    }
                } else {
                    groupInfo[0] = 0
                }
            })
            .catch(err => {
                //console.log(err);
            })

        //console.log(groupInfo)
        this.state = { posts, groupInfo };
    }

    handleRatingUpdate = (post, value) => {
        this.state.posts[post].rating = value
    }

    postRatingsToDB = () => {
        const url = 'http://localhost:8080/api/v1/sendDebateResults'
        const headers = {
            'Content-Type': 'text/plain',
        }

        for (var i = 0; i < 3; i++) {

            var username = this.state.posts[i].username
            var rating = this.state.posts[i].rating

            axios.post(url, { 'ratingUser': btoa(sessionStorage.getItem('username')), 'scoredUser': btoa(username), 'score': rating }, { headers }
            )
                .then(res => {
                })
                .catch(err => {
                    //console.log(err);
                })

            setTimeout(() => {
                this.filler()
            }, 200)
        }

        console.log("done")
        window.location.reload();
    }

    filler = () => {
        console.log("filler")
    }

    render() {
        return (
            <div className="fetchposts">
                { this.state.groupInfo[0] === 1 ? (
                    <div>
                        <div className="question-answered">
                            <h2>The question they answered was</h2>
                            <h1>{this.state.groupInfo[1]}</h1>
                            <h4>this is what they said..</h4>
                        </div>
                        {this.state.posts.map((user, index) => (
                            <div className="user-post" key={index}>
                                <div className="user-info">
                                    <p key={index}>{user.username}</p>
                                </div>
                                <div className="user-post-line"></div>

                                <div className="question">
                                    <p key={index}>{user.post}</p>
                                </div>

                                <div className="user-post-line"></div>

                                {/* <div className="rating-bar"><p>Rate this post?</p></div> */}
                                <div className="rating-slider"><Slider postNum={index} ratingValue={user.rating} overallRating={user.overallRating} handleRatingUpdate={this.handleRatingUpdate} /></div>

                            </div>
                        ))}
                        <div className="submitButton">
                            <button className="q1" onClick={this.postRatingsToDB}>Submit Ratings</button>
                        </div>
                        <div className="submitMessage">Once you submit your ratings, you will be given the next available debate group to rate and won't be able to come back to the this group.</div>
                    </div>
                ) : (
                        <>
                            <div className="group-dne">
                                <h1>Sorry, no groups were found..</h1>
                                <h2>Come back later!</h2>
                            </div>
                        </>
                    )}
            </div>
        );
    }
}

export default FetchPosts;