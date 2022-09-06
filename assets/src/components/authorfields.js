function AuthorFields({ drupalConfig, authorFields, setAuthorFields }) {
  const onChangeEmail = (event) => {
    setAuthorFields({email: event.target.value});
  };

  return (
    <div className="col-md-12">
      <label>Email</label>
      <input
        type="email"
        autoComplete="email"
        placeholder="Email"
        required
        value={authorFields.email}
        onChange={(e) => onChangeEmail(e)}
      />
    </div>
  );
}

export default AuthorFields;
