export function Placeholder() {
  return (
    <div className="placeholder">
      <p> To start counting click the
        <span className="button">
          <svg>
            <use href="icons.svg#plus"/>
          </svg>
        </span> sign <br/>
        when Yonote tab is active.
      </p>
    </div>
  )
}