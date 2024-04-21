
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
	const IncDec = require('./expresiones/IncDec')
	const Ternaria = require('./expresiones/ternario')
	const AccesoVar = require('./expresiones/AccesoVar')


	const Llamada = require('./instrucciones/Llamada')
	const ModArrayU = require('./instrucciones/ModArrayU')
	const AccesoArrayU = require('./instrucciones/AccesoArrayU')
	const Execute = require('./instrucciones/Execute')
	const Metodo = require('./instrucciones/Metodo')
	const If = require('./instrucciones/If')
	const While = require('./instrucciones/While')
	const DoWhile = require('./instrucciones/doWhile')
	const For = require('./instrucciones/For')
	const Switch = require('./instrucciones/Switch')
	const Case = require('./instrucciones/Case')
	const Default = require('./instrucciones/Default')
	const Break = require('./instrucciones/Break')
	const Continue = require('./instrucciones/Continue')
	const Print = require('./instrucciones/Print')
	const Declaracion = require('./instrucciones/Declaracion')
	const DeclaracionInit = require('./instrucciones/DeclaracionInit')
	const AsignacionVar = require('./instrucciones/AsignacionVar')
	const ArrayU = require('./instrucciones/ArrayU')
	const ArrayD = require('./instrucciones/ArrayD')
	const Return = require('./instrucciones/Return')

	const Errores = require('./excepciones/Errores')
	const indexController = require('../indexController')
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
//----------Incremento y Decremento----------
"++"					return 'INCREMENTO'
"--"					return 'DECREMENTO'
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
"<<"                   	return 'PRINTMENOR'
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
";"                   	return 'PUNTO_COMA'
","                   	return 'COMA'
"."                   	return 'PUNTO'

":"						return 'DOSPUNTOS'
"{"                   	return 'LLAVE_IZQ'
"}"                   	return 'LLAVE_DER'
//"'"						return 'COMILLA_SIMPLE'
//-------------Operadores Booleanos--------
"true"                	return 'TRUE'
"false"               	return 'FALSE'

//----------Sentencias----------------
"new"					return 'NEW'
//----------Sentencias de Control------------
"if"					return 'SENT_IF'
"else"					return 'SENT_ELSE'
"switch"				return 'SENT_SWITCH'
"case"					return 'SENT_CASE'
"endl"					return 'SENT_ENDL'
"default"			    return 'SENT_DEFAULT'
//----------Sentencias Ciclicas--------------
"while"               	return 'SENT_WHILE'
"for"					return 'SENT_FOR'
"do"					return 'SENT_DO'
//-------Sentencias de Transferencia----------
"break"					return 'SENT_BREAK'
"continue"				return 'SENT_CONTINUE'
"return"				return 'SENT_RETURN'
"void"					return 'VOID'
"imprimir"              return 'IMPRIMIR'
//-------Funciones----------
"cout"                  return 'SENT_COUT'
"tolower"				return 'SENT_TOLOWER'
"toupper"				return 'SENT_TOUPPER'
"round"					return 'SENT_ROUND'
".length()"				return 'SENT_LENGTH'
//--------Funciones Nativas--------
//"length"				return 'SENT_LENGTH'
"typeof"				return 'SENT_TYPEOF'
"toString"				return 'SENT_TOSTRING'
"c_str"			        return 'SENT_TOCHARARRAY'
"execute"				return 'SENT_EXECUTE'
//-----------ER----------------
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
.                   	{let error = new Errores.default("LEXICO",("token invalido: "+yytext),yylloc.first_line,yylloc.first_column); 
						indexController.listaErrores.push(error);}
						

//IMPORTACIONES
%{
	
    
%}

/lex


// Precedencias
%left 'OP_TERNARIO'
%left 'OR'
%left 'AND'
%right 'NOT'
%left 'IGUALACIONDOBLE' 'DIFERENCIACION' 'MENOR' 'MENORIGUAL' 'MAYOR' 'MAYORIGUAL'
%left 'ARI_SUMA' 'ARI_MENOS'
%left 'ARI_MULTIPLICACION' 'ARI_DIVISION' 'ARI_MODULO'
%left 'INCREMENTO','DECREMENTO'
%left signoMenos
%left 'PARENTESIS_IZQ'
%left 'SENT_LENGTH'




%start INICIO

%%

INICIO : INSTRUCCIONES EOF                  {return $1;}
;

INSTRUCCIONES : INSTRUCCIONES INSTRUCCION   {$1.push($2); $$=$1;}
            | INSTRUCCION                 {$$=[$1];}
;

INSTRUCCION : IMPRESION             {$$=$1;}
            | DECLARACION PUNTO_COMA          {$$=$1;}
            | ASIGNACION PUNTO_COMA           {$$=$1;}
			| OPC_IF							  {$$=$1;}
			| INS_WHILE						  {$$=$1;}
			| INS_BREAK						  {$$=$1;}
			|INS_CONTINUE					{$$=$1;}
			|INS_FOR						  {$$=$1;}
			|INS_DOWHILE					  {$$=$1;}
			| INS_SWITCH					{$$=$1;}
			| DECLARACION_ARREGLO 	  {$$=$1;}
			| FUN_METODO						{$$=$1;}
			| FUN_EXE 				{$$=$1;}
			| FUN_LLAMADA PUNTO_COMA		        {$$=$1;}
			| MOD_VECTOR 						{$$=$1;}
			| INS_RETURN 				{$$=$1;}
			| DECLARACION_ARREGLO_D   {$$=$1;}
;

IMPRESION : SENT_COUT PRINTMENOR EXPRESION FINALPRINT    
				{if ($4 == true){
					$$= new Print.default($3,true,@1.first_line, @1.first_column);
				}else{
					$$= new Print.default($3,false, @1.first_line, @1.first_column);
				}
				
				}
;

FINALPRINT : PRINTMENOR SENT_ENDL PUNTO_COMA	{$$=true;}
			| PUNTO_COMA						{$$=false;}
;

DECLARACION : TIPOS LISTA_VAR  ASIGNACION_DECLARACION  
{
			if($3 == true){
				$$ = new DeclaracionInit.default($1, @1.first_line, @1.first_column, $2);
			}else{
				$$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $3);
			}
}
;

ASIGNACION_DECLARACION : IGUALACION EXPRESION {$$= $2;}
					|  {$$=true;}
;


ASIGNACION : IDENTIFICADOR IGUALACION EXPRESION             {$$ = new AsignacionVar.default($1, $3, @1.first_line, @1.first_column);}
			
			| INC_DEC				{$$=$1;}
;

LISTA_VAR : LISTA_VAR COMA IDENTIFICADOR	{$1.push($3); $$=$1;}
			| IDENTIFICADOR					{$$=[$1];}	
;


FUN_METODO : TIPOS IDENTIFICADOR PARENTESIS_IZQ PARAMETROS PARENTESIS_DER LLAVE_IZQ INSTRUCCIONES LLAVE_DER		{$$ = new Metodo.default($2,$1,$4,$7, @1.first_line, @1.first_column);}
			| TIPOS IDENTIFICADOR PARENTESIS_IZQ PARENTESIS_DER LLAVE_IZQ INSTRUCCIONES LLAVE_DER				{$$ = new Metodo.default($2,$1,[],$6, @1.first_line, @1.first_column);}
;


PARAMETROS : PARAMETROS COMA TIPOS IDENTIFICADOR	{ $1.push({tipo:$3, id:[$4]}); $$=$1;} 
			| TIPOS IDENTIFICADOR					{$$ = [{tipo:$1, id:[$2]}];}
;

FUN_EXE : SENT_EXECUTE IDENTIFICADOR PARENTESIS_IZQ PARAMETROSLLAMADA PARENTESIS_DER PUNTO_COMA	{$$ = new Execute.default($2,@1.first_line, @1.first_column, $4 );}
			| SENT_EXECUTE IDENTIFICADOR PARENTESIS_IZQ PARENTESIS_DER PUNTO_COMA					{$$ = new Execute.default($2, @1.first_line, @1.first_column, [])}
;

PARAMETROSLLAMADA : PARAMETROSLLAMADA COMA EXPRESION		 {$1.push($3); $$=$1;}
					| EXPRESION									{$$=[$1];}
;

FUN_LLAMADA : IDENTIFICADOR PARENTESIS_IZQ PARAMETROSLLAMADA PARENTESIS_DER		{$$ = new Llamada.default($1, $3,@1.first_line, @1.first_column);}
			| IDENTIFICADOR PARENTESIS_IZQ PARENTESIS_DER 						{$$ = new Llamada.default($1, [], @1.first_line, @1.first_column);}
;

EXPRESION : EXPRESION ARI_SUMA EXPRESION          {$$ = new Aritmeticas.default(Aritmeticas.Operadores.SUMA, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION ARI_MENOS EXPRESION        {$$ = new Aritmeticas.default(Aritmeticas.Operadores.RESTA, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION ARI_MULTIPLICACION EXPRESION        {$$ = new Aritmeticas.default(Aritmeticas.Operadores.MULT, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION ARI_DIVISION EXPRESION        {$$ = new Aritmeticas.default(Aritmeticas.Operadores.DIVI, @1.first_line, @1.first_column, $1, $3);}
			| ARI_POTENCIA PARENTESIS_IZQ EXPRESION COMA EXPRESION PARENTESIS_DER       {$$ = new Aritmeticas.default(Aritmeticas.Operadores.ARI_POTENCIA, @1.first_line, @1.first_column, $3, $5);}
			| EXPRESION ARI_MODULO EXPRESION    {$$ = new Aritmeticas.default(Aritmeticas.Operadores.ARI_MODULO, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION IGUALACIONDOBLE EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.IGUALACIONDOBLE, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION DIFERENCIACION EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.DIFERENCIACION, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION MENOR EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.MENOR, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION MENORIGUAL EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.MENORIGUAL, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION MAYOR EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.MAYOR, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION MAYORIGUAL EXPRESION        {$$ = new Relacionales.default(Relacionales.Operadores.MAYORIGUAL, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION OR EXPRESION        		{$$ = new Logicos.default(Logicos.Operadores.OR, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION AND EXPRESION        		{$$ = new Logicos.default(Logicos.Operadores.AND, @1.first_line, @1.first_column, $1, $3);}
			| NOT EXPRESION        					{$$ = new Logicos.default(Logicos.Operadores.NOT, @1.first_line, @1.first_column, $2);}
			| EXPRESION  SENT_LENGTH 	{$$ = new FuncionesNativas.default(FuncionesNativas.Operadores.SENT_LENGTH, @1.first_line, @1.first_column, $1);}
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
			| INS_TERNARIO								{$$=$1;}
			| ACCESO_VECTOR								{$$=$1;}
			| FUN_LLAMADA								{$$=$1;}
;

// PROD_TEMP: IDENTIFICADOR PARENTESIS_IZQ PARAMETROSLLAMADA PARENTESIS_DER		{$$ = new Llamada.default($1, @1.first_line, @1.first_column, $3);}
// ;

TIPOS : INTEGER             {$$ = new Tipo.default(Tipo.tipoDato.INTEGER);}
		| DOUBLE          {$$ = new Tipo.default(Tipo.tipoDato.DOUBLE);}
		| STRING          {$$ = new Tipo.default(Tipo.tipoDato.STRING);}
		| BOOLEAN          {$$ = new Tipo.default(Tipo.tipoDato.BOOLEAN);}
		|CHAR			{$$ = new Tipo.default(Tipo.tipoDato.CHAR);}
		|VOID			{$$ = new Tipo.default(Tipo.tipoDato.VOID);}
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

INC_DEC : IDENTIFICADOR SIG_INCDEC		{$$ = new IncDec.default($1, @1.first_line, @1.first_column, $2);}
;

SIG_INCDEC :  INCREMENTO {$$ = true;}
			| DECREMENTO {$$ = false;}
;

OPC_IF  :   SENT_IF PARENTESIS_IZQ EXPRESION PARENTESIS_DER LLAVE_IZQ INSTRUCCIONES LLAVE_DER
        {$$ = new If.default($3, $6,null, @1.first_line, @1.first_column);}
        |   SENT_IF PARENTESIS_IZQ EXPRESION PARENTESIS_DER LLAVE_IZQ INSTRUCCIONES LLAVE_DER OPC_ELSE
        {$$ = new If.default($3, $6,$8, @1.first_line, @1.first_column);}
;

OPC_ELSE    :   SENT_ELSE OPC_IF
            { let inst_else = [];inst_else.push($2);$$ = inst_else;}
        | SENT_ELSE LLAVE_IZQ INSTRUCCIONES LLAVE_DER
            { $$ = $3;}
;

DECLARACION_ARREGLO : TIPOS IDENTIFICADOR COR_IZQ COR_DER IGUALACION NEW TIPOS COR_IZQ EXPRESION COR_DER PUNTO_COMA	{$$ = new ArrayU.default($1, $2, @1.first_line, @1.first_column,$7, $9,[]);}
					| TIPOS IDENTIFICADOR COR_IZQ COR_DER IGUALACION COR_IZQ LISTAVALORES COR_DER PUNTO_COMA	{$$ = new ArrayU.default($1, $2, @1.first_line, @1.first_column,undefined, undefined,$7);}
;

LISTAVALORES : LISTAVALORES COMA EXPRESION {$1.push($3); $$=$1;}
				| EXPRESION {$$=[$1];}
;

ACCESO_VECTOR : IDENTIFICADOR COR_IZQ EXPRESION COR_DER  {$$= new AccesoArrayU.default($1,$3,@1.first_line, @1.first_column);}
;

MOD_VECTOR : IDENTIFICADOR COR_IZQ EXPRESION COR_DER IGUALACION EXPRESION PUNTO_COMA		{$$= new ModArrayU.default($1,$3,$6,@1.first_line, @1.first_column);}
;


INS_WHILE: SENT_WHILE PARENTESIS_IZQ EXPRESION PARENTESIS_DER LLAVE_IZQ INSTRUCCIONES LLAVE_DER {$$ = new While.default($3, $6, @1.first_line, @1.first_column );}
;

INS_DOWHILE: SENT_DO LLAVE_IZQ INSTRUCCIONES LLAVE_DER SENT_WHILE PARENTESIS_IZQ EXPRESION PARENTESIS_DER PUNTO_COMA	{$$ = new DoWhile.default($7, $3, @1.first_line, @1.first_column );}
;
INS_FOR: SENT_FOR PARENTESIS_IZQ DECLARACION PUNTO_COMA EXPRESION PUNTO_COMA ASIGNACION PARENTESIS_DER LLAVE_IZQ INSTRUCCIONES LLAVE_DER {$$ = new For.default($3, $5, $7, $10, @1.first_line, @1.first_column );}
;

INS_BREAK : SENT_BREAK PUNTO_COMA		{$$ = new Break.default(@1.first_line, @1.first_column);}
;

INS_CONTINUE : SENT_CONTINUE PUNTO_COMA		{$$ = new Continue.default(@1.first_line, @1.first_column);}
;

INS_TERNARIO : EXPRESION OP_TERNARIO EXPRESION DOSPUNTOS EXPRESION {$$ = new Ternaria.default($1,$3,$5,@1.first_line,@1.first_column)}
;

INS_SWITCH: SENT_SWITCH PARENTESIS_IZQ EXPRESION PARENTESIS_DER LLAVE_IZQ LISTA_CASE OPC_DEFAULT LLAVE_DER {$$ = new Switch.default($3,$6,@1.first_line,@1.first_column,$7)}
			| SENT_SWITCH PARENTESIS_IZQ EXPRESION PARENTESIS_DER LLAVE_IZQ LISTA_CASE LLAVE_DER {$$ = new Switch.default($3,$6,@1.first_line,@1.first_column,undefined)}
			| SENT_SWITCH PARENTESIS_IZQ EXPRESION PARENTESIS_DER OPC_DEFAULT LLAVE_DER {$$ = new Switch.default($3,[],@1.first_line,@1.first_column,$5)}
;

OPC_CASE : SENT_CASE EXPRESION DOSPUNTOS INSTRUCCIONES  {$$ = new Case.default($2,$4, @1.first_line,@1.first_column)}
;

LISTA_CASE : LISTA_CASE OPC_CASE {$1.push($2); $$=$1;}
			| OPC_CASE			{$$ = [$1];}

;

OPC_DEFAULT : SENT_DEFAULT DOSPUNTOS INSTRUCCIONES {$$ = new Default.default($3, @1.first_line,@1.first_column)}
;

INS_RETURN : SENT_RETURN PUNTO_COMA				{$$ = new Return.default(@1.first_line,@1.first_column)}
			| SENT_RETURN EXPRESION PUNTO_COMA 	{$$ = new Return.default(@1.first_line,@1.first_column,$2)}
;



DECLARACION_ARREGLO_D: TIPOS IDENTIFICADOR COR_IZQ COR_DER COR_IZQ COR_DER IGUALACION NEW TIPOS COR_IZQ EXPRESION COR_DER COR_IZQ EXPRESION COR_DER PUNTO_COMA {$$ = new ArrayD.default($1,$2,@1.first_line,@1.first_column,$9,$11,$14,undefined);}
					| TIPOS IDENTIFICADOR COR_IZQ COR_DER COR_IZQ COR_DER IGUALACION COR_IZQ LISTA_PARA_ARREGLO COR_DER PUNTO_COMA			{$$ = new ArrayD.default($1,$2,@1.first_line, @1.first_column,undefined,undefined,undefined,$9);}
;
LISTA_PARA_ARREGLO: LISTA_PARA_ARREGLO COMA DIMENSIONES {$1.push($3); $$=$1;}
					| DIMENSIONES					{$$=[$1];}
;
DIMENSIONES : COR_IZQ INDEX COR_DER			{$$=$2}
;
INDEX: INDEX COMA EXPRESION			{$1.push($3); $$=$1;}
		| EXPRESION				{$$=[$1];}
;