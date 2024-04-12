
%{
	var cadena = '';
	var errors = [];
	const Tipo = require('./simbolo/Tipo')
	const Nativo = require('./expresiones/Nativo')
	const Aritmeticas = require('./expresiones/Aritmeticas')
	const Relacionales = require('./expresiones/Relacionales')
	const Logicos = require('./expresiones/Logicos')
	const Casteo = require('./expresiones/Casteos')
	const Funciones = require('./expresiones/Funciones')
	const FuncionesNativas = require('./expresiones/FuncionesNativas')
	const AccesoVar = require('./expresiones/AccesoVar')

	const Print = require('./instrucciones/Print')
	const Declaracion = require('./instrucciones/Declaracion')
	const AsignacionVar = require('./instrucciones/AsignacionVar')
%}
%lex

%options case-insensitive
%x string

%%

\s+                   				// Espacios en blanco
"//".*								// Comentario de una linea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]	// Comentario Multilinea
//----------Tipo de dato----------
"double"             	return 'DOUBLE'
"int"             		return 'INTEGER'
"bool"              	return 'BOOLEAN'
"char"             		return 'CHAR'
"std::String"		    return 'STRING'
"std"					return 'STD'
//----------Operadores Aritmeticos----------
"+"                   	return 'ARI_SUMA'
"-"                   	return 'ARI_MENOS'
"*"                   	return 'ARI_MULTIPLICACION'
"/"                   	return 'ARI_DIVISION'
"POW"                   return 'ARI_POTENCIA'
"%"                   	return 'ARI_MODULO'
//----------Operadores Relacionales----------
"!="                   	return 'DIFERENCIACION'
"=="                   	return 'IGUALACIONDOBLE'
"="                   	return 'IGUALACION'
"<="                   	return 'MENORIGUAL'
">="					return 'MAYORIGUAL'
">"                   	return 'MAYOR'
"<"                   	return 'MENOR'
//----------Operadores Logicos----------
"||"                   	return 'OR'
"&&"                   	return 'AND'
"!"                     return 'NOT'
//----------Signos de Agrupacion----------
"("                   	return 'PARENTESIS_IZQ'
")"                   	return 'PARENTESIS_DER'
"?"						return 'OP_TERNARIO'
"["						return 'COR_IZQ'
"]"						return 'COR_DER'
//------------Otro operadores-------------
","                   	return 'COMA'
"."                   	return 'PUNTO'
";"                   	return 'PUNTO_COMA'
":"						return 'DOSPUNTOS'
"{"                   	return 'LLAVE_IZQ'
"}"                   	return 'LLAVE_DER'
//"'"						return 'COMILLA_SIMPLE'
//-------------Operadores Booleanos--------
"true"                	return 'TRUE'
"false"               	return 'FALSE'
//----------Incremento y Decremento----------
"++"					return 'INCREMENTO'
"--"					return 'DECREMENTO'
//----------Sentencias----------------
"new"					return 'NEW'
//----------Sentencias de Control------------
"if"					return 'SENT_IF'
"else"					return 'SENT_ELSE'
"switch"				return 'SENT_SWITCH'
"case"					return 'SENT_CASE'
"break"					return 'SENT_BREAK'
"default"			    return 'SENT_DEFAULT'
//----------Sentencias Ciclicas--------------
"while"               	return 'SENT_WHILE'
"for"					return 'SENT_FOR'
"do"					return 'SENT_DO'
//-------Sentencias de Transferencia----------
"break"					return 'SENT_BREAK'
"continue"				return 'SENT_CONTINUE'
"return"				return 'SENT_RETURN'
"void"					return 'SENT_VOID'
"imprimir"              return 'IMPRIMIR'
//-------Funciones----------
"cout"                  return 'SENT_COUT'
"tolower"				return 'SENT_TOLOWER'
"toupper"				return 'SENT_TOUPPER'
"round"					return 'SENT_ROUND'
//--------Funciones Nativas--------
"length"				return 'SENT_LENGTH'
"typeof"				return 'SENT_TYPEOF'
"toString"				return 'SENT_TOSTRING'
"c_str"			        return 'SENT_TOCHARARRAY'
"execute"				return 'SENT_RUN'
//-----------ER----------------
//^[a-zA-Z0-9_]$      return 'CARACTER_UNICO'
([a-zA-Z])([a-zA-Z0-9_])* return 'IDENTIFICADOR'


[']\\\\[']|[']\\\"[']|[']\\\'[']|[']\\n[']|[']\\t[']|[']\\r[']|['].?[']	return 'CARACTER_UNICO'
'[a-zA-Z0-9_]'					return 'CARACTER'
[0-9]+"."[0-9]+         return "NUM_DECIMAL"
[0-9]+                  return "NUM_ENTERO"
["]						{ cadena = ''; this.begin("string"); }
<string>[^"\\]+			{ cadena += yytext; }
<string>"\\\""			{ cadena += "\""; }
<string>"\\n"			{ cadena += "\n"; }
<string>\s				{ cadena += " ";  }
<string>"\\t"			{ cadena += "\t"; }
<string>"\\\\"			{ cadena += "\\"; }
<string>"\\\'"			{ cadena += "\'"; }
<string>"\\r"			{ cadena += "\r"; }
<string>["]				{ yytext = cadena; this.popState(); return 'CADENA'; }
//-----------Fin de Cadena----------------
<<EOF>>               	return 'EOF'
//------Errores(cualquier cosa menos lo declarado)-----
.                     	{ errors.push({ tipo: "Lexico", error: yytext, linea: yylloc.first_line, columna: yylloc.first_column+1 }); return 'ERROR_LEX'; } 

//IMPORTACIONES
%{
	
    
%}

/lex


// Precedencias
%left 'OP_TERNARIO'
%left 'AND'
%left 'OR'
%right 'NOT'
%left 'IGUALACIONDOBLE' 'DIFERENCIACION' 'MENOR' 'MENORIGUAL' 'MAYOR' 'MAYORIGUAL'
%left 'ARI_SUMA' 'ARI_MENOS'
%left 'ARI_MULTIPLICACION' 'ARI_DIVISION'
%left signoMenos
%left PARENTESIS_IZQ


%start INICIO

%%

INICIO : INSTRUCCIONES EOF                  {return $1;}
;

INSTRUCCIONES : INSTRUCCIONES INSTRUCCION   {$1.push($2); $$=$1;}
            | INSTRUCCION                 {$$=[$1];}
;

INSTRUCCION : IMPRESION PUNTO_COMA            {$$=$1;}
            | DECLARACION PUNTO_COMA          {$$=$1;}
            | ASIGNACION PUNTO_COMA           {$$=$1;}
;

IMPRESION : IMPRIMIR PARENTESIS_IZQ EXPRESION PARENTESIS_DER    {$$= new Print.default($3, @1.first_line, @1.first_column);}
;

DECLARACION : TIPOS LISTA_VAR IGUALACION EXPRESION      {$$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $4);}
;

ASIGNACION : IDENTIFICADOR IGUALACION EXPRESION             {$$ = new AsignacionVar.default($1, $3, @1.first_line, @1.first_column);}
;

LISTA_VAR : LISTA_VAR COMA IDENTIFICADOR	{$1.push($3); $$=$1;}
			| IDENTIFICADOR					{$$=[$1];}	
;


EXPRESION : EXPRESION ARI_SUMA EXPRESION          {$$ = new Aritmeticas.default(Aritmeticas.Operadores.SUMA, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION ARI_MENOS EXPRESION        {$$ = new Aritmeticas.default(Aritmeticas.Operadores.RESTA, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION IGUALACIONDOBLE EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.IGUALACIONDOBLE, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION DIFERENCIACION EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.DIFERENCIACION, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION MENOR EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.MENOR, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION MENORIGUAL EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.MENORIGUAL, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION MAYOR EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.MAYOR, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION MAYORIGUAL EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.MAYORIGUAL, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION OR EXPRESION        		{$$ = new Logicos.default(Logicos.Operadores.OR, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION AND EXPRESION        		{$$ = new Logicos.default(Logicos.Operadores.AND, @1.first_line, @1.first_column, $1, $3);}
			| NOT EXPRESION        					{$$ = new Logicos.default(Logicos.Operadores.NOT, @1.first_line, @1.first_column, $2);}
			| CASTEO 									{$$ = $1;}
			| FUNCION 									{$$ = $1;}
			| FUN_NATIVA								{$$ = $1;}
			| PARENTESIS_IZQ EXPRESION PARENTESIS_DER              {$$ = $2;}
			| ARI_MENOS EXPRESION %prec UMENOS     {$$ = new Aritmeticas.default(Aritmeticas.Operadores.NEG, @1.first_line, @1.first_column, $2);}
			| NUM_ENTERO                           {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.INTEGER), $1, @1.first_line, @1.first_column );}
			| NUM_DECIMAL                          {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.DOUBLE), $1, @1.first_line, @1.first_column );}
			| TRUE                          {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOLEAN), true, @1.first_line, @1.first_column );}
			| FALSE                          {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOLEAN), false, @1.first_line, @1.first_column );}
			| CARACTER_UNICO							{$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CHAR), $1, @1.first_line, @1.first_column );}
			| CADENA                           {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.STRING), $1, @1.first_line, @1.first_column );}
			| IDENTIFICADOR                           {$$ = new AccesoVar.default($1, @1.first_line, @1.first_column);}    
;

TIPOS : INTEGER             {$$ = new Tipo.default(Tipo.tipoDato.INTEGER);}
		| DOUBLE          {$$ = new Tipo.default(Tipo.tipoDato.DOUBLE);}
		| STRING          {$$ = new Tipo.default(Tipo.tipoDato.STRING);}
		| BOOLEAN          {$$ = new Tipo.default(Tipo.tipoDato.BOOLEAN);}
		|CHAR			{$$ = new Tipo.default(Tipo.tipoDato.CHAR);}
	;

CASTEO : PARENTESIS_IZQ TIPOS PARENTESIS_DER EXPRESION  {$$ = new Casteo.default($2, @1.first_line, @1.first_column, $4);}
;

FUNCION : SENT_TOLOWER PARENTESIS_IZQ EXPRESION PARENTESIS_DER {$$ = new Funciones.default(Funciones.Operadores.SENT_TOLOWER, @1.first_line, @1.first_column, $3);}
		| SENT_TOUPPER PARENTESIS_IZQ EXPRESION PARENTESIS_DER {$$ = new Funciones.default(Funciones.Operadores.SENT_TOUPPER, @1.first_line, @1.first_column, $3);}
		| SENT_ROUND PARENTESIS_IZQ EXPRESION PARENTESIS_DER {$$ = new Funciones.default(Funciones.Operadores.SENT_ROUND, @1.first_line, @1.first_column, $3);}
;

FUN_NATIVA  : SENT_TYPEOF PARENTESIS_IZQ EXPRESION PARENTESIS_DER		{$$ = new FuncionesNativas.default(FuncionesNativas.Operadores.SENT_TYPEOF, @1.first_line, @1.first_column, $3);}
			| STD DOSPUNTOS DOSPUNTOS SENT_TOSTRING PARENTESIS_IZQ EXPRESION PARENTESIS_DER	{$$ = new FuncionesNativas.default(FuncionesNativas.Operadores.SENT_TOSTRING, @1.first_line, @1.first_column, $6);}
;