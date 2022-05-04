/*eslint-disable */
const App = () => {
  const excalidrawWrapperRef = React.useRef(null);
  const [dimensions, setDimensions] = React.useState({width: undefined, height: undefined})
  const [viewModeEnabled, setViewModeEnabled] = React.useState(false);
  const [zenModeEnabled, setZenModeEnabled] = React.useState(false);
  const [gridModeEnabled, setGridModeEnabled] = React.useState(false);

  React.useEffect(() => {
    const { width, height } = excalidrawWrapperRef.current.getBoundingClientRect()
    setDimensions({ width, height });
    const onResize = () => {
      const { width, height } = excalidrawWrapperRef.current.getBoundingClientRect()
      setDimensions({ width, height });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [excalidrawWrapperRef]);

  return React.createElement(React.Fragment, null,
    React.createElement("div", {
      className: "excalidraw-wrapper",
      ref: excalidrawWrapperRef
    }, React.createElement(Excalidraw.default,{
      initialData: InitialData,
      // onChange: (elements, state) => console.log("Elements :", elements, "State : ", state),
      // onPointerUpdate: (payload) => console.log(payload),
      onCollabButtonClick: () => window.alert("You clicked on collab button"),
      viewModeEnabled: viewModeEnabled,
      zenModeEnabled: zenModeEnabled,
      gridModeEnabled: gridModeEnabled,
    }))
  );
};

const main = async function() {
  const ubj = new URL(location.href)
  const src = ubj.searchParams.get('src')
  if (src) {
    window.InitialData = await fetch(src, {json:true}).then(r=>r.json())
    console.log(Excalidraw.exportToSvg(InitialData));
  } else window.InitialData = {}
  ReactDOM.render(React.createElement(App), document.getElementById("app"));
}
main()
