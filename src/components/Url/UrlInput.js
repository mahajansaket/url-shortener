import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { TextField } from "mui-rff";
import { Grid, Button, CssBaseline, IconButton } from "@material-ui/core";
import { GitHub, Language } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { Form } from "react-final-form";
import { INSERT_URL } from "../Graphql";

const TinyURL = require("tinyurl");

const validate = (values) => {
  const errors = {};
  if (!values.url) {
    errors.url = "Required";
  }
  return errors;
};

const UrlInput = () => {
  const [shortUrl, setShortUrl] = useState();
  const [addUrl, setAddUrl] = useMutation(INSERT_URL, {
    update: (proxy, mutationResult) => {
      const resData = mutationResult.data.insert_url_shortener.returning[0];
      setShortUrl(resData);
      console.log(
        "mutationResult: ",
        mutationResult.data.insert_url_shortener.returning[0].tinyurl
      );
      console.log("shortURL", resData);
    },
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function isUrl(s) {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    console.log(regexp.test(s));
    return regexp.test(s);
  }

  const onSubmit = async (values) => {
    if (isUrl(values.url)) {
      const url = values.url;
      const a = TinyURL.shorten(values.url).then(
        function (res) {
          addUrl({ variables: { url, tinyurl: res } });
          enqueueSnackbar("Success: Tiny URL created", { variant: "success" });
          console.log(res); // Returns a shorter version of http://google.com - http://is.gd/OwycZW
        },
        function (err) {
          console.log(err);
        }
      );
      console.log(shortUrl);
    } else {
      enqueueSnackbar("Error: URL should be of format http://www.example.com", {
        variant: "error",
      });
    }
  };

  return (
    <div style={{ padding: 16, margin: "auto", maxWidth: "auto" }}>
      <CssBaseline />
      <Grid container alignItems="flex-start" spacing={2}>
        {/* <a href={ "https://serene-escarpment-09925.herokuapp.com/"} target="_blank">Link</a> */}
      </Grid>
      <Form
        onSubmit={onSubmit}
        // initialValues={{ employed: true, stooge: 'larry' }}
        validate={validate}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container alignItems="flex-start" spacing={2}>
              <label>Enter URL</label>
              <TextField
                fullWidth
                type="text"
                label="URL"
                placeholder="URL Format: http://www.example.com"
                name="url"
                margin="none"
                required={true}
              />
              <Grid item style={{ marginTop: 16 }}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={form.reset}
                  disabled={submitting || pristine}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item style={{ marginTop: 16 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
            {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}

            {shortUrl ? (
              <div>
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={12}>
                    URL:{" "}
                    <a href={`${shortUrl.url}`} target="_blank">
                      {shortUrl.url}
                    </a>
                  </Grid>
                  <Grid item xs={12}>
                    Shortened URL:{" "}
                    <a href={`${shortUrl.tinyurl}`} target="_blank">
                      {shortUrl.tinyurl}
                    </a>
                  </Grid>
                </Grid>
              </div>
            ) : (
              <div>
                {" "}
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={12}>
                    Welcome to URL Shortener!
                    <IconButton
                      edge="end"
                      aria-label="web link"
                      aria-haspopup="true"
                      color="inherit"
                      onClick={(event) =>
                        window.open(
                          "https://serene-escarpment-09925.herokuapp.com",
                          "_blank"
                        )
                      }
                    >
                      <Language />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="github link"
                      aria-haspopup="true"
                      color="inherit"
                      onClick={(event) =>
                        window.open(
                          "https://github.com/mahajansaket/url-shortener",
                          "_blank"
                        )
                      }
                    >
                      <GitHub />
                    </IconButton>
                  </Grid>
                  <Grid item xs={12}>
                    URL Format: http://www.example.com
                  </Grid>
                </Grid>
              </div>
            )}
          </form>
        )}
      />
    </div>
  );
};

export default UrlInput;
